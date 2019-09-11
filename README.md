# gallery

## Introduction
E-Gallery is a jQuery-powered, customizable, and fully responsive image gallery library made by [Elementor](https://elementor.com/).

**Main Features**
-   Three different responsive layouts: grid, justified and masonry.
-   Customizable number of columns
-   Customizable row height
-   Customizable row and column spacing
-   Support for custom breakpoints

## Setup
1.  Clone this repository.
2.  In your local repo folder, run `npm install`.
3.  Once installation is complete, run `npm run build` for production deployment, or `npm run dev` for a development version.
4.  In the newly-created `dist` folder, you will find two subfolders: `js` and `css`. These folders will contain both regular and minified versions of the `e-gallery.js` and `e-gallery.css` files.
5.  If you already have jQuery in your project, those are the only files you must include in your own project for the gallery to work. If you don’t have jQuery in your project, you should include it (before the `e-gallery.js` file, since jQuery is a dependency of E-Gallery.

## Usage

The gallery can either create its HTML markup automatically, or use existing HTML markup.

### Initialization
The gallery is initialized by instantiating a new eGallery object, and passing it an options object:

`const gallery = new eGallery( {options} );`.

### Without existing markup
To use the gallery, you need a single empty container `<div>` element, which you pass in to the options object, as the `container` property. The container property can receive either a reference to the element, a jQuery instance of the element, or a jQuery selector for the element (if it has a `class` or `id` attribute, for example).

An example in which the container is created in Javascript (jQuery), and its jQuery reference is passed into the container property:

```
<body>
	<script>
	const galleryContainer = jQuery( ‘<div>’ );

	jQuery( ‘body’ ).append( container );

	const gallery = new eGallery( {
		container: galleryContainer
	} );
	</script>
</body>
```

An example in which an existing `<div>` element is used, and its selector is passed into the container property:

```
<body>
<div class=”gallery-container”></div>
	<script>
	const gallery = new eGallery( {
		container: ‘.gallery-container’
	} );
	</script>
</body>
```

### Using existing markup
If you already have existing HTML markup, the E-Gallery library can use it and construct the gallery on top of it.
The gallery’s basic element hierarchy:
-   Container
	-   Item (default selector: `.e-gallery-item`)
		-   Image (default selector: `.e-gallery-image`)

There are two ways to use existing markup:
1.  Adding the library’s default element class names to your existing markup
2.  Overwriting the gallery’s jQuery selectors with your own existing selectors

#### 1. Example markup using the library’s default class names:
```
<body>
	<div class=”gallery-container”>
		<div class=”e-gallery-item”>
			<div class=”e-gallery-image” style=”background-image: url(“/images/1.png”)”></div>
		</div>
		<div class=”e-gallery-item”>
			<div class=”e-gallery-image” style=”background-image: url(“/images/2.png”)”></div>
		</div>
		<div class=”e-gallery-item”>
			<div class=”e-gallery-image” style=”background-image: url(“/images/3.png”)”></div>
		</div>
		<div class=”e-gallery-item”>
			<div class=”e-gallery-image” style=”background-image: url(“/images/4.png”)”></div>
		</div>
	</div>
	<script>
	const gallery = new eGallery( {
		container: ‘.gallery-container’
	} );
	</script>
</body>
```

It doesn’t matter whether the `item` and `image` elements have additional classes and attributes, as long as they have the E-Gallery-defined element classes.

#### 2. Overwriting the library’s selectors:
```
const gallery = new eGallery( {
	container: ‘.gallery-container’,
	selectors: {
		items: ‘your-item-selector-here’,
		image: ‘your-image-selector-here’,
	}
} );
```

The values passed to the `items` and `image` properties can be any valid jQuery selectors.
