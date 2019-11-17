export default function elementInView( element, elementPart = 'top' ) {
	const elementTop = element.getBoundingClientRect().top,
		elementHeight = element.offsetHeight,
		elementBottom = elementTop + elementHeight;

	let elementPosition;

	if ( 'middle' === elementPart ) {
		elementPosition = elementTop + ( elementHeight / 2 );
	} else if ( 'bottom' === elementPart ) {
		elementPosition = elementBottom;
	} else {
		elementPosition = elementTop;
	}

	return elementPosition <= innerHeight && elementBottom >= 0;
}
