import BaseGalleryType from './base';

export default class Masonry extends BaseGalleryType {
	run( refresh ) {
		const currentBreakpoint = this.getCurrentBreakpoint();

		if ( ! refresh && currentBreakpoint === this.currentBreakpoint ) {
			return;
		}

		this.currentBreakpoint = currentBreakpoint;

		const heights = [],
			itemsInColumn = [],
			aggregatedHeights = [],
			columns = this.getCurrentDeviceSetting( 'columns' ),
			containerWidth = this.$container.width(),
			horizontalGap = this.getCurrentDeviceSetting( 'horizontalGap' ),
			itemWidth = ( containerWidth - ( horizontalGap * ( columns - 1 ) ) ) / columns,
			$items = this.getActiveItems();
		let naturalColumnHeight = 0;

		for ( let i = 0; i < columns; i++ ) {
			itemsInColumn[ i ] = 0;
			heights[ i ] = 0;
		}

		$items.each( ( index, item ) => {
			const imageData = this.getImageData( index ),
				itemHeight = itemWidth / imageData.ratio;
			let indexAtRow = index % columns;

			naturalColumnHeight = heights[ indexAtRow ];
			jQuery.each( heights, ( colNumber, currentColHeight ) => {
				if ( currentColHeight && naturalColumnHeight > currentColHeight + 5 ) {
					naturalColumnHeight = currentColHeight;
					indexAtRow = colNumber;
				}
			} );

			aggregatedHeights[ index ] = heights[ indexAtRow ];
			heights[ indexAtRow ] += itemHeight;

			item.style.setProperty( '--item-height', ( imageData.height / imageData.width * 100 ) + '%' );
			item.style.setProperty( '--column', indexAtRow );
			item.style.setProperty( '--items-in-column', itemsInColumn[ indexAtRow ] );
			itemsInColumn[ indexAtRow ]++;
		} );

		const highestColumn = Math.max( ...heights ),
			highestColumnIndex = heights.indexOf( highestColumn ),
			rows = itemsInColumn[ highestColumnIndex ],
			highestColumnsGapsCount = rows - 1,
			containerAspectRatio = highestColumn / containerWidth;

		this.$container[ 0 ].style.setProperty( '--columns', columns );
		this.$container[ 0 ].style.setProperty( '--highest-column-gap-count', highestColumnsGapsCount );

		this.$container.css( 'padding-bottom', ( containerAspectRatio * 100 ) + '%' );

		$items.each( ( index, item ) => {
			const percentHeight = aggregatedHeights[ index ] ? aggregatedHeights[ index ] / highestColumn * 100 : 0;
			item.style.setProperty( '--percent-height', percentHeight + '%' );
		} );
	}
}
