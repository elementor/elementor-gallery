export default class BaseGalleryType {
	constructor( settings ) {
		this.settings = $.extend( true, this.getDefaultSettings(), settings );

		this.$container = $( this.settings.container );

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
			$window: $( window ),
		};

		this.$container.addClass( this.getItemClass( this.settings.classes.container ) + ' ' + this.getItemClass( this.settings.type ) );
	}

	bindEvents() {
		this.elements.$window.on( 'resize', this.runGallery );
	}

	createItem( itemData ) {
		const { classes } = this.settings,
			$item = $( '<div>', { class: this.getItemClass( classes.item ) } ),
			$image = $( '<div>', { class: this.getItemClass( classes.image ) } ).css( 'background-image', 'url(' + itemData.thumbnail + ')' );

		$item.append( $image );

		if ( itemData.url ) {
			const $link = $( '<a>', { class: this.getItemClass( classes.link ), href: itemData.url } );

			$image.wrap( $link );
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

	runGallery() {
		const containerStyle = this.$container[ 0 ].style;

		containerStyle.setProperty( '--hgap', this.getCurrentDeviceSetting( 'horizontalGap' ) + 'px' );
		containerStyle.setProperty( '--vgap', this.getCurrentDeviceSetting( 'verticalGap' ) + 'px' );
		containerStyle.setProperty( '--animation-duration', this.settings.animationDuration + 'ms' );

		this.run();
	}

	unbindEvents() {
		this.elements.$window.off( 'resize', this.runGallery );
	}

	destroy() {
		this.unbindEvents();
	}
}
