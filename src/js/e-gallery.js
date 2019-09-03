import GridGallery from './types/grid';
import JustifiedGallery from './types/justified';
import MasonryGallery from './types/masonry';

import eGalleryScss from '../scss/eGallery.scss';

export default class EGallery {
	constructor( userSettings ) {
		this.settings = jQuery.extend( true, this.getDefaultSettings(), userSettings );

		this.initGalleriesTypes();

		this.createGallery();
	}

	getDefaultSettings() {
		return {
			container: null,
			type: 'grid',
			columns: 5,
			horizontalGap: 10,
			verticalGap: 10,
			animationDuration: 300,
			classesPrefix: 'e-gallery-',
			classes: {
				container: 'container',
				item: 'item',
				image: 'image',
				link: 'link',
				firstRowItem: 'first-row-item',
				animated: '-animated',
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
		const GalleryHandlerType = this.galleriesTypes[ this.settings.type ];

		this.galleryHandler = new GalleryHandlerType( this.settings );
	}

	destroy() {
		this.galleryHandler.destroy();
	}
}
