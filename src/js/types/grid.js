import BaseGalleryType from './base';

export default class Grid extends BaseGalleryType {
	getDefaultSettings() {
		return {
			aspectRatio: '16:9',
		};
	}

	setItemsPosition() {
		const columns = this.getCurrentDeviceSetting( 'columns' );

		this.$items.each( ( index, item ) => {
			item.style.setProperty( '--column', index % columns );
			item.style.setProperty( '--row', Math.floor( index / columns ) );
		} );
	}

	setContainerSize() {
		const columns = this.getCurrentDeviceSetting( 'columns' ),
			rows = Math.ceil( this.settings.items.length / columns ),
			containerStyle = this.$container[ 0 ].style;

		containerStyle.setProperty( '--columns', columns );

		containerStyle.setProperty( '--rows', rows );

		const itemWidth = this.$items.width(),
			aspectRatio = this.settings.aspectRatio.split( ':' ),
			aspectRatioPercents = aspectRatio[ 1 ] / aspectRatio[ 0 ],
			itemHeight = aspectRatioPercents * itemWidth,
			totalHeight = itemHeight * rows + ( this.getCurrentDeviceSetting( 'horizontalGap' ) * ( rows - 1 ) ),
			calculatedAspectRatio = totalHeight / this.$container.width() * 100;

		containerStyle.setProperty( '--aspect-ratio', ( aspectRatioPercents * 100 ) + '%' );
		containerStyle.setProperty( '--container-aspect-ratio', calculatedAspectRatio + '%' );
	}

	run() {
		const animatedClass = this.getItemClass( this.settings.classes.animated );

		this.$container.addClass( animatedClass );

		setTimeout( () => {
			this.setItemsPosition();

			this.setContainerSize();

			setTimeout( () => this.$container.removeClass( animatedClass ), this.settings.animationDuration );
		}, 100 );
	}
}
