import elementInView from '../element-in-view';

export default class BaseGalleryType {
	constructor( settings ) {
		this.settings = jQuery.extend( true, this.getDefaultSettings(), settings );

		this.$container = jQuery( this.settings.container );

		this.timeouts = [];

		this.initElements();

		this.prepareGallery();

		const oldRunGallery = this.runGallery.bind( this );

		this.runGallery = this.debounce( () => {
			if ( this.settings.lazyLoad ) {
				oldRunGallery();
			} else {
				this.allImagesPromise.then( oldRunGallery );
			}
		}, 300 );

		this.handleScroll = this.debounce( () => this.lazyLoadImages(), 16 );

		this.bindEvents();

		this.runGallery();
	}

	getDefaultSettings() {
		return {};
	}

	getItemClass( className ) {
		return this.settings.classesPrefix + className;
	}

	initElements() {
		this.elements = {
			$window: jQuery( window ),
		};

		const directionClass = '-' + ( this.settings.rtl ? 'rtl' : 'ltr' ),
			lazyLoadClass = this.settings.lazyLoad ? '-lazyload' : '',
			containerClasses = this.getItemClass( this.settings.classes.container ) + ' ' + this.getItemClass( this.settings.type ) + ' ' + this.getItemClass( directionClass ) + ' ' + this.getItemClass( lazyLoadClass );

		this.$container.addClass( containerClasses );
	}

	bindEvents() {
		this.elements.$window.on( 'resize', this.runGallery );

		if ( this.settings.lazyLoad ) {
			this.elements.$window.on( 'scroll', this.handleScroll );
		}
	}

	getNestedObjectData( object, key ) {
		const keyStack = key.split( '.' ),
			currentKey = keyStack.splice( 0, 1 );

		if ( ! keyStack.length ) {
			return { object, key };
		}

		return this.getNestedObjectData( object[ currentKey ], keyStack.join( '.' ) );
	}

	getTemplateArgs( args, key ) {
		const nestedObjectData = this.getNestedObjectData( args, key );

		return nestedObjectData.object[ nestedObjectData.key ] || '';
	}

	getCurrentBreakpoint() {
		const breakpoints = Object.keys( this.settings.breakpoints ).map( Number ).sort( ( a, b ) => a - b );

		let currentBreakpoint = 0;

		breakpoints.some( ( breakpoint ) => {
			if ( innerWidth < breakpoint ) {
				currentBreakpoint = breakpoint;

				return true;
			}

			return false;
		} );

		return currentBreakpoint;
	}

	getCurrentDeviceSetting( settingKey ) {
		const currentBreakpoint = this.getCurrentBreakpoint();

		if ( currentBreakpoint ) {
			return this.settings.breakpoints[ currentBreakpoint ][ settingKey ];
		}

		return this.settings[ settingKey ];
	}

	getActiveItems( returnIndexes = false ) {
		const activeTags = this.settings.tags,
			activeIndexes = [];

		if ( ! activeTags.length ) {
			return this.$items;
		}

		const filteredItems = this.$items.filter( ( index, item ) => {
			let itemTags = item.dataset.eGalleryTags;

			if ( ! itemTags ) {
				return false;
			}

			itemTags = itemTags.split( /[ ,]+/ );

			if ( activeTags.some( ( tag ) => itemTags.includes( tag ) ) ) {
				if ( returnIndexes ) {
					activeIndexes.push( index );
				}

				return true;
			}

			return false;
		} );

		if ( returnIndexes ) {
			return activeIndexes;
		}

		return filteredItems;
	}

	getImageData( index ) {
		if ( this.settings.tags.length ) {
			index = this.getActiveItems( true )[ index ];
		}

		return this.imagesData[ index ];
	}

	compileTemplate( template, args ) {
		return template.replace( /{{([^}]+)}}/g, ( match, placeholder ) => this.getTemplateArgs( args, placeholder.trim() ) );
	}

	createOverlay( overlayData ) {
		const { classes, overlayTemplate } = this.settings,
			$overlay = jQuery( '<div>', { class: this.getItemClass( classes.overlay ) } ),
			overlayContent = this.compileTemplate( overlayTemplate, jQuery.extend( true, this.settings, overlayData ) );

		$overlay.html( overlayContent );

		return $overlay;
	}

	createItem( itemData ) {
		const { classes } = this.settings,
			$item = jQuery( '<div>', { class: this.getItemClass( classes.item ), 'data-e-gallery-tags': itemData.tags } ),
			$image = jQuery( '<div>', { class: this.getItemClass( classes.image ) } ).css( 'background-image', 'url(' + itemData.thumbnail + ')' );

		let $overlay;

		if ( this.settings.overlay ) {
			$overlay = this.createOverlay( itemData );
		}

		let $contentWrapper = $item;

		if ( itemData.url ) {
			$contentWrapper = jQuery( '<a>', { class: this.getItemClass( classes.link ), href: itemData.url } );

			$item.html( $contentWrapper );
		}

		$contentWrapper.html( $image );

		if ( $overlay ) {
			$contentWrapper.append( $overlay );
		}

		return $item;
	}

	debounce( func, wait ) {
		let timeout;

		return ( ...args ) => {
			clearTimeout( timeout );

			timeout = setTimeout( () => func( ...args ), wait );

			this.timeouts.push( timeout );
		};
	}

	buildGallery() {
		const { items } = this.settings;

		this.$items = jQuery();

		items.forEach( ( item ) => {
			const $item = this.createItem( item );

			this.$items = this.$items.add( $item );

			this.$container.append( $item );
		} );
	}

	loadImages() {
		const allPromises = [];

		this.settings.items.forEach( ( item, index ) => {
			const image = new Image(),
				promise = new Promise( ( resolve ) => {
					image.onload = resolve;
				} );

			allPromises.push( promise );

			promise.then( () => this.calculateImageSize( image, index ) );

			image.src = item.thumbnail;
		} );

		this.allImagesPromise = Promise.all( allPromises );
	}

	lazyLoadImages() {
		if ( ! this.settings.lazyLoad || this.settings.lazyLoadComplete ) {
			return;
		}

		let loadedItems = 0;
		this.settings.lazyLoadComplete = false;

		this.$items.each( ( index, item ) => {
			if ( ! item.loaded && elementInView( item ) ) {
				const image = new Image(),
					promise = new Promise( ( resolve ) => {
						image.onload = resolve;
					} ),
					$image = jQuery( item ).find( this.settings.selectors.image );

				promise.then( () => {
					$image.css( 'background-image', 'url(' + this.settings.items[ index ].thumbnail + ')' ).addClass( 'e-gallery-image-loaded' );
					item.loaded = true;
				} );
				image.src = this.settings.items[ index ].thumbnail;
			}
			if ( item.loaded ) {
				loadedItems++;
				if ( loadedItems === this.settings.items.length ) {
					this.settings.lazyLoadComplete = true;
				}
			}
			return true;
		} );
	}

	calculateImageSize( image, index ) {
		this.imagesData[ index ] = {
			width: image.width,
			height: image.height,
			ratio: image.width / image.height,
		};
	}

	createImagesData() {
		this.settings.items.forEach( ( item, index ) => this.calculateImageSize( item, index ) );
	}

	makeGalleryFromContent() {
		const { selectors } = this.settings,
			isLazyLoad = this.settings.lazyLoad,
			items = [];

		this.$items = this.$container.find( selectors.items );

		this.$items.each( ( index, item ) => {
			const $image = jQuery( item ).find( selectors.image );

			items[ index ] = { thumbnail: $image.data( 'thumbnail' ) };

			if ( isLazyLoad ) {
				items[ index ].width = $image.data( 'width' );
				items[ index ].height = $image.data( 'height' );
				items[ index ].loaded = false;
			} else {
				$image.css( 'background-image', `url("${ imageSource }")` );
			}
		} );

		this.settings.items = items;
	}

	prepareGallery() {
		if ( this.settings.items ) {
			this.buildGallery();
		} else {
			this.makeGalleryFromContent();
		}

		this.imagesData = [];

		if ( this.settings.lazyLoad ) {
			this.createImagesData();
		} else {
			this.loadImages();
		}
	}

	runGallery( refresh ) {
		const containerStyle = this.$container[ 0 ].style;

		containerStyle.setProperty( '--hgap', this.getCurrentDeviceSetting( 'horizontalGap' ) + 'px' );
		containerStyle.setProperty( '--vgap', this.getCurrentDeviceSetting( 'verticalGap' ) + 'px' );
		containerStyle.setProperty( '--animation-duration', this.settings.animationDuration + 'ms' );

		this.$items.addClass( this.getItemClass( this.settings.classes.hidden ) );

		this.getActiveItems().removeClass( this.getItemClass( this.settings.classes.hidden ) );

		if ( this.settings.lazyLoad ) {
			setTimeout( () => this.lazyLoadImages(), 300 );
		}

		this.run( refresh );
	}

	setSettings( key, value ) {
		const nestedObjectData = this.getNestedObjectData( this.settings, key );

		if ( nestedObjectData.object ) {
			nestedObjectData.object[ nestedObjectData.key ] = value;

			this.runGallery( true );
		}
	}

	unbindEvents() {
		this.elements.$window.off( 'resize', this.runGallery );
	}

	destroy() {
		this.unbindEvents();

		this.$container.empty();

		this.timeouts.forEach( ( timeout ) => clearTimeout( timeout ) );
	}
}
