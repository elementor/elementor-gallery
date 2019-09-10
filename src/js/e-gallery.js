import GridGallery from './types/grid';
import JustifiedGallery from './types/justified';
import MasonryGallery from './types/masonry';

import eGalleryScss from '../scss/e-gallery.scss';

export default class EGallery {
	constructor( userSettings ) {
		this.userSettings = userSettings;

		this.initGalleriesTypes();

		this.createGallery();
	}

	getDefaultSettings() {
		return {
			container: null,
			items: null,
			type: 'grid',
			overlay: false,
			overlayTemplate: '<div class="{{ classesPrefix }}{{ classes.overlayTitle }}">{{ title }}</div><div class="{{ classesPrefix }}{{ classes.overlayDescription }}">{{ description }}</div>',
			columns: 5,
			horizontalGap: 10,
			verticalGap: 10,
			animationDuration: 300,
			classesPrefix: 'e-gallery-',
			classes: {
				container: 'container',
				item: 'item',
				image: 'image',
				overlay: 'overlay',
				overlayTitle: 'overlay__title',
				overlayDescription: 'overlay__description',
				link: 'link',
				firstRowItem: 'first-row-item',
				animated: '-animated',
			},
			selectors: {
				items: '.e-gallery-item',
				image: '.e-gallery-image',
			},
			breakpoints: {
				1024: {
					horizontalGap: 5,
					verticalGap: 5,
					columns: 4,
				},
				768: {
					horizontalGap: 1,
					verticalGap: 1,
					columns: 2,
				},
			},
		};
	}

	initGalleriesTypes() {
		this.galleriesTypes = {
			grid: GridGallery,
			justified: JustifiedGallery,
			masonry: MasonryGallery,
		};
	}

	createGallery() {
		const settings = jQuery.extend( true, this.getDefaultSettings(), this.userSettings );

		const GalleryHandlerType = this.galleriesTypes[ settings.type ];

		this.galleryHandler = new GalleryHandlerType( settings );
	}

	setSettings( key, value ) {
		this.galleryHandler.setSettings( key, value );
	}

	destroy() {
		this.galleryHandler.destroy();
	}
}
