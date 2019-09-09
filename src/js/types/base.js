export default class BaseGalleryType {
	constructor( settings ) {
		this.settings = jQuery.extend( true, this.getDefaultSettings(), settings );

		this.$container = jQuery( this.settings.container );

		this.runGallery = this.debounce( this.runGallery.bind( this ), 300 );

		this.initElements();

		this.prepareGallery();

		this.bindEvents();
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

		this.$container.addClass( this.getItemClass( this.settings.classes.container ) + ' ' + this.getItemClass( this.settings.type ) );
	}

	bindEvents() {
		this.elements.$window.on( 'resize', this.runGallery );
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
			$item = jQuery( '<div>', { class: this.getItemClass( classes.item ) } ),
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

		return function( ...args ) {
			const context = this;

			const later = () => {
				timeout = null;

				func.apply( context, args );
			};

			clearTimeout( timeout );

			timeout = setTimeout( later, wait );
		};
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

	buildGallery() {
		const { items } = this.settings;

		this.$items = jQuery();

		items.forEach( ( item ) => {
			const $item = this.createItem( item );

			this.$items = this.$items.add( $item );

			this.$container.append( $item );
		} );
	}

	calculateImageSize( image, index ) {
		this.imagesData[ index ] = {
			width: image.width,
			height: image.height,
			ratio: image.width / image.height,
		};
	}

	loadImages() {
		const allPromises = [];

		this.imagesData = [];

		jQuery.each( this.settings.items, ( index ) => {
			const image = new Image(),
				promise = new Promise( ( resolve ) => {
					image.onload = resolve;
				} );

			allPromises.push( promise );

			promise.then( () => this.calculateImageSize( image, index ) );

			image.src = this.settings.items[ index ].thumbnail;
		} );

		Promise.all( allPromises ).then( () => this.runGallery() );
	}

	prepareGallery() {
		this.buildGallery();

		this.loadImages();
	}

	runGallery( refresh ) {
		const containerStyle = this.$container[ 0 ].style;

		containerStyle.setProperty( '--hgap', this.getCurrentDeviceSetting( 'horizontalGap' ) + 'px' );
		containerStyle.setProperty( '--vgap', this.getCurrentDeviceSetting( 'verticalGap' ) + 'px' );
		containerStyle.setProperty( '--animation-duration', this.settings.animationDuration + 'ms' );

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
	}
}
