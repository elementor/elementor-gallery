const gridGallery = new EGallery( {
	container: '#grid-gallery-container',
	type: 'grid',
	items: [
		{ thumbnail: 'images/1.jpg' },
		{ thumbnail: 'images/2.jpg' },
		{ thumbnail: 'images/3.jpg' },
		{ thumbnail: 'images/4.jpg' },
		{ thumbnail: 'images/5.jpg' },
		{ thumbnail: 'images/6.jpg' },
	],
} );

new EGallery( {
	container: '#justified-gallery-container',
	type: 'justified',
	items: [
		{ thumbnail: 'images/1.jpg' },
		{ thumbnail: 'images/2.jpg' },
		{ thumbnail: 'images/3.jpg' },
		{ thumbnail: 'images/4.jpg' },
		{ thumbnail: 'images/5.jpg' },
		{ thumbnail: 'images/6.jpg' },
	],
} );

const masonryGallery = new EGallery( {
	container: '#masonry-gallery-container',
	type: 'masonry',
	items: [
		{ thumbnail: 'images/1.jpg' },
		{ thumbnail: 'images/2.jpg' },
		{ thumbnail: 'images/3.jpg' },
		{ thumbnail: 'images/4.jpg' },
		{ thumbnail: 'images/5.jpg' },
		{ thumbnail: 'images/6.jpg' },
	],
} );

const aspectRatioLinks = $( '#aspect-ratio-choose .link' ),
	columnLinks = $( '#columns-choose .link' );

aspectRatioLinks.on( 'click', ( event ) => {
	event.preventDefault();

	const target = $( event.target );

	gridGallery.setSettings( 'aspectRatio', target.data( 'aspect-ratio' ) );

	aspectRatioLinks.removeClass( 'link-active' );

	target.addClass( 'link-active' );
} );

columnLinks.on( 'click', ( event ) => {
	event.preventDefault();

	const target = $( event.target );

	masonryGallery.setSettings( 'columns', target.data( 'columns' ) );

	columnLinks.removeClass( 'link-active' );

	target.addClass( 'link-active' );
} );
