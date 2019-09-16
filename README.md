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
5.  If you already have jQuery in your project, those are the only files you must include in your own project for the gallery to work. If you don't have jQuery in your project, you should include it (before the `e-gallery.js` file, since jQuery is a dependency of E-Gallery.

## Usage
### Initialization
The gallery is initialized by instantiating a new eGallery object, and passing it an options object:

`new eGallery( {options} );`.

Passing the images to the gallery can be done in two different ways:
Passing an array of "image" objects to the library in the `options` object
Using HTML markup, which the library will scan and use.

### 1. Passing an array of images to the options object
To use the gallery, you need a single empty container `<div>` element, which you pass in to the options object, as the `container` property. The container property can receive either a reference to the element, a jQuery instance of the element, or a jQuery selector for the element (if it has a `class` or `id` attribute, for example).

In the following example, a `<div>` container element is used. The element's jQuery selector is passed into the container property:

```
<body>
	<div id="galleryContainer"></div>
	<script>
	new eGallery( {
		container: '#galleryContainer',
		items: [
			{ thumbnail: 'image/path/image1.jpg' },
			{ thumbnail: 'image/path/image2.jpg' },
			{ thumbnail: 'image/path/image3.jpg' },
			{ thumbnail: 'image/path/image4.jpg' },
		],
	} );
	</script>
</body>
```
Passing the `items` property in the options object is **mandatory** in this use case. `items` must receive an array of objects (representing images), each with a thumbnail property pointing to the image's file path.

### 2. Using HTML markup
The E-Gallery library can read HTML markup and use it and construct the gallery.
The gallery's basic element hierarchy:
-   Container
	-   Item (default selector: `.e-gallery-item`)
		-   Image (default selector: `.e-gallery-image`)

There are two ways to use HTML markup to pass items to the E-Gallery library:
1.  Adding the library's default element class names to your HTML markup
2.  Overwriting the gallery's jQuery selectors with your own selectors

#### 1. Example markup using the library's default class names:
```
<body>
	<div id="galleryContainer">
		<div class="e-gallery-item">
			<div class="e-gallery-image" style="background-image: url("/images/1.png")"></div>
		</div>
		<div class="e-gallery-item">
			<div class="e-gallery-image" style="background-image: url("/images/2.png")"></div>
		</div>
		<div class="e-gallery-item">
			<div class="e-gallery-image" style="background-image: url("/images/3.png")"></div>
		</div>
		<div class="e-gallery-item">
			<div class="e-gallery-image" style="background-image: url("/images/4.png")"></div>
		</div>
	</div>
	<script>
	new eGallery( {
		container: ' #galleryContainer'
	} );
	</script>
</body>
```

It doesn't matter if the `item` and `image` elements have additional classes and attributes, as long as they have the E-Gallery-defined selectors.

#### 2. Overwriting the library's selectors:
```
new eGallery( {
	container: '#galleryContainer',
	selectors: {
		items: 'your-item-selector-here',
		image: 'your-image-selector-here',
	}
} );
```
The values passed to the `items` and `image` properties can be any valid jQuery selectors.
You should only change the jQuery selectors if you use your own HTML markup for the gallery.

## Options

|  Option Property  |                                                                                                                                                                                  Description                                                                                                                                                                                  | Variable Type | Default Value |
|:-----------------:|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------:|:-------------:|
|        type       | Type of Gallery. Available types: 'grid', 'justified', 'masonry'                                                                                                                                                                                                                                                                                                              |     string    |     'grid'    |
|   idealRowHeight  | Sets a custom height for the gallery images                                                                                                                                                                                                                                                                                                                                   |     number    |      null     |
|     container     | The jQuery selector for the gallery's container element                                                                                                                                                                                                                                                                                                                       |     string    |      null     |
|      columns      | Number of columns in the gallery                                                                                                                                                                                                                                                                                                                                              |     number    |       5       |
|    aspectRatio    | In grid mode, the aspect ratio set for the gallery images                                                                                                                                                                                                                                                                                                                     |     string    |     '16:9'    |
|      lastRow      | In Justified galleries, this parameter determines how images are rendered in the last row of the gallery. Options are 'normal' (renders images with the same height as other rows), 'hide' (does not display the last row), and 'fit' (divides the row width between the last row's images. This option might result in much larger image sizes than the rest of the gallery) |     string    |    'normal'   |
|   horizontalGap   | The spacing between gallery columns                                                                                                                                                                                                                                                                                                                                           |     number    |       5       |
|    verticalGap    | The spacing between gallery rows                                                                                                                                                                                                                                                                                                                                              |     number    |       5       |
| animationDuration | The duration of the animation for transition effects, such as the gallery's auto-realignment on resize                                                                                                                                                                                                                                                                        |     number    |      0.3s     |
|   classesPrefix   | A string prefix to gallery element classes                                                                                                                                                                                                                                                                                                                                    |     string    |  'e-gallery-' |
|    breakpoints    | Settings for custom breakpoints. Settings that can be configured for different breakpoints: horizontalGap, verticalGap, columns.                                                                                                                                                                                                                                              |     object    |      null     |
