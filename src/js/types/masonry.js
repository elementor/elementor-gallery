import BaseGalleryType from './base';

export default class Masonry extends BaseGalleryType {
	run( refresh ) {
		const currentBreakpoint = this.getCurrentBreakpoint();

		if ( ! refresh && currentBreakpoint === this.currentBreakpoint ) {
			return;
		}

		this.currentBreakpoint = currentBreakpoint;

		const heights = [],
			aggregatedHeights = [],
			columns = this.getCurrentDeviceSetting( 'columns' ),
			containerWidth = this.$container.width(),
			horizontalGap = this.getCurrentDeviceSetting( 'horizontalGap' ),
			itemWidth = ( containerWidth - ( horizontalGap * ( columns - 1 ) ) ) / columns,
			$items = this.getActiveItems();

		$items.each( ( index, item ) => {
			const row = Math.floor( index / columns ),
				indexAtRow = index % columns,
				imageData = this.imagesData[ index ],
				itemHeight = itemWidth / imageData.ratio;

			item.style.setProperty( '--item-height', ( imageData.height / imageData.width * 100 ) + '%' );
			item.style.setProperty( '--column', indexAtRow );

			if ( row ) {
				aggregatedHeights[ index ] = heights[ indexAtRow ];

				heights[ indexAtRow ] += itemHeight;
			} else {
				heights.push( itemHeight );
			}
		} );

		const highestColumn = Math.max( ...heights ),
			highestColumnIndex = heights.indexOf( highestColumn ),
			rows = Math.floor( this.settings.items.length / columns ),
			rowsRemainder = this.settings.items.length % columns,
			highestColumnsGapsCount = rowsRemainder > highestColumnIndex ? rows : rows - 1,
			containerAspectRatio = highestColumn / containerWidth;

		this.$container[ 0 ].style.setProperty( '--columns', columns );
		this.$container[ 0 ].style.setProperty( '--highest-column-gap-count', highestColumnsGapsCount );

		this.$container.css( 'padding-bottom', ( containerAspectRatio * 100 ) + '%' );

		$items.each( ( index, item ) => {
			const percentHeight = aggregatedHeights[ index ] ? aggregatedHeights[ index ] / highestColumn * 100 : 0,
				row = Math.floor( index / columns );

			item.style.setProperty( '--percent-height', percentHeight + '%' );
			item.style.setProperty( '--row', row );
		} );
	}
}
