import BaseGalleryType from './base';

export default class Justified extends BaseGalleryType {
	getDefaultSettings() {
		return {
			idealRowHeight: 200,
			lastRow: 'normal',
			breakpoints: {
				1024: {
					idealRowHeight: 150,
					lastRow: 'fit',
				},
				768: {
					idealRowHeight: 100,
					lastRow: 'fit',
				},
			},
		};
	}

	run() {
		this.rowsHeights = [];

		this.rowsCount = 0;

		this.containerWidth = this.$container.width();

		this.makeJustifiedRow( 0 );
	}

	makeJustifiedRow( startIndex ) {
		let oldRowWidth = 0;

		for ( let index = startIndex; ; index++ ) {
			let itemComputedWidth = Math.round( this.getCurrentDeviceSetting( 'idealRowHeight' ) * this.imagesData[ index ].ratio );

			if ( itemComputedWidth > this.containerWidth ) {
				itemComputedWidth = this.containerWidth;
			}

			const newRowWidth = oldRowWidth + itemComputedWidth;

			if ( newRowWidth > this.containerWidth ) {
				const oldDiff = this.containerWidth - oldRowWidth,
					newDiff = newRowWidth - this.containerWidth;

				if ( oldDiff < newDiff ) {
					this.fitImagesInContainer( startIndex, index, oldRowWidth );

					this.rowsCount++;

					this.makeJustifiedRow( index );

					break;
				}
			}

			const isLastItem = index === this.getActiveItems().length - 1;

			this.imagesData[ index ].computedWidth = itemComputedWidth;

			if ( isLastItem ) {
				const lastRowMode = this.getCurrentDeviceSetting( 'lastRow' );

				if ( 'hide' !== lastRowMode ) {
					const totalRowWidth = 'fit' === lastRowMode ? newRowWidth : this.containerWidth;

					this.fitImagesInContainer( startIndex, index + 1, totalRowWidth );
				}

				this.inflateGalleryHeight();

				break;
			}

			oldRowWidth = newRowWidth;
		}
	}

	fitImagesInContainer( startIndex, endIndex, rowWidth ) {
		const gapCount = endIndex - startIndex - 1,
			$items = this.getActiveItems();

		let aggregatedWidth = 0;

		for ( let index = startIndex; index < endIndex; index++ ) {
			const imageData = this.imagesData[ index ],
				percentWidth = imageData.computedWidth / rowWidth,
				item = $items.get( index ),
				firstRowItemClass = this.getItemClass( this.settings.classes.firstRowItem );

			item.style.setProperty( '--item-width', percentWidth );
			item.style.setProperty( '--gap-count', gapCount );
			item.style.setProperty( '--item-height', ( ( imageData.height / imageData.width ) * 100 ) + '%' );
			item.style.setProperty( '--item-left', aggregatedWidth );
			item.style.setProperty( '--item-row-index', index - startIndex );

			aggregatedWidth += percentWidth;

			if ( index === startIndex ) {
				item.classList.add( firstRowItemClass );

				const imagePxWidth = percentWidth * ( this.containerWidth - ( gapCount * this.getCurrentDeviceSetting( 'horizontalGap' ) ) );

				this.rowsHeights.push( imagePxWidth / imageData.ratio );
			} else {
				item.classList.remove( firstRowItemClass );
			}
		}
	}

	inflateGalleryHeight() {
		const totalRowsHeight = this.rowsHeights.reduce( ( total, item ) => total + item ),
			finalContainerHeight = totalRowsHeight + this.rowsCount * this.getCurrentDeviceSetting( 'verticalGap' ),
			containerAspectRatio = finalContainerHeight / this.containerWidth,
			percentRowsHeights = this.rowsHeights.map( ( rowHeight ) => rowHeight / finalContainerHeight * 100 );

		let currentRow = -1,
			accumulatedTop = 0;

		this.getActiveItems().each( ( index, item ) => {
			const itemRowIndex = item.style.getPropertyValue( '--item-row-index' ),
				isFirstItem = '0' === itemRowIndex;

			if ( isFirstItem ) {
				currentRow++;

				if ( currentRow ) {
					accumulatedTop += percentRowsHeights[ currentRow - 1 ];
				}
			}

			item.style.setProperty( '--item-top', accumulatedTop + '%' );
			item.style.setProperty( '--item-height', percentRowsHeights[ currentRow ] + '%' );
			item.style.setProperty( '--row', currentRow );
		} );

		this.$container[ 0 ].style.setProperty( '--container-aspect-ratio', containerAspectRatio );
	}
}
