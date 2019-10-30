export default function elementInView( element, elementPart = 'top' ) {
	const windowHeight = window.innerHeight,
		elementTop = element.getBoundingClientRect().top,
		elementHeight = element.offsetHeight,
		elementMiddle = elementTop + ( elementHeight / 2 ),
		elementBottom = elementTop + elementHeight;

	let elementPosition;

	if ( 'top' === elementPart.toLowerCase() ) {
		elementPosition = elementTop;
	} else if ( 'middle' === elementPart.toLowerCase() ) {
		elementPosition = elementMiddle;
	} else if ( 'bottom' === elementPart.toLowerCase() ) {
		elementPosition = elementBottom;
	} else {
		elementPosition = elementTop;
	}

	return ( elementPosition <= windowHeight ) && ( elementBottom >= 0 );
}
