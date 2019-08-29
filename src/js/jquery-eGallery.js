import EGallery from './eGallery';

const $ = jQuery;

$.fn.eGallery = function( settings ) {
	const isCommand = 'string' === typeof settings;

	this.each( function( index, ...args ) {
		const $this = $( this );

		if ( ! isCommand ) {
			settings.container = this;

			$this.data( 'eGallery', new EGallery( settings ) );

			return;
		}

		const instance = $this.data( 'eGallery' );

		if ( ! instance ) {
			throw new Error( 'Trying to perform the `' + settings + '` method prior to initialization' );
		}

		if ( ! instance[ settings ] ) {
			throw new ReferenceError( 'Method `' + settings + '` not found in gallery instance' );
		}

		instance[ settings ]( instance, ...args );

		if ( 'destroy' === settings ) {
			$this.removeData( 'eGallery' );
		}
	} );

	return this;
};
