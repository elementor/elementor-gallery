# E-Gallery

## Introduction
E-Gallery is a jQuery-powered, customizable, reactive image gallery library made by [Elementor](https://elementor.com/).

#### Main Features
-   Fully responsive and reactive - reorganizes and resizes images on viewport changes (e.g., on window resize)
-   Includes three different responsive layouts: grid, justified and masonry
-   Filterable by image tags
-   Lightweight - Only 14.7KB minified JS+CSS (5KB gzipped)
-   Highly performant - most calculations are done with CSS
-   Customizable number of columns
-   Customizable row and column spacing
-   Support for custom breakpoints

## Setup
1.  Clone this repository.
2.  In your local repo folder, run `npm install`.
3.  Once installation is complete, run `npm run build` for production deployment, or `npm run dev` for a development version.
4.  In the newly-created `dist` folder, you will find two subfolders: `js` and `css`. These folders will contain both regular and minified versions of the `e-gallery.js` and `e-gallery.css` files.
5. The `dist` folder also includes a `jquery-e-gallery.js` file, which turns the gallery into a jQuery plugin. If you wish to use the gallery as a jQuery plugin, use this file instead of the `e-gallery.js` file.
6.  If you already have jQuery in your project, those are the only files you must include in your own project for the gallery to work. If you don't have jQuery in your project, you should include it (before the `e-gallery.js` file, since jQuery is a dependency of E-Gallery.

## Usage
### Initialization
The gallery is initialized by instantiating a new eGallery object, and passing it an options object:

`new EGallery( {options} );`.

Passing the images to the gallery can be done in two different ways:
Passing an array of "image" objects to the library in the `options` object
Using HTML markup, which the library will scan and use.

### 1. Passing an array of images to the options object
To use the gallery, you need a single empty container `<div>` element, which you pass in to the options object, as the `container` property. The container property can receive either a reference to the container DOM element, a jQuery instance of the element, or a jQuery selector for the element (if it has a `class` or `id` attribute, for example).

In the following example, a `<div>` container element is used. The element's jQuery selector is passed into the container property:

```html
<body>
	<div id="gallery-container"></div>
	<script>
	new EGallery( {
		container: '#gallery-container',
		items: [
			{
			  thumbnail: 'image/path/image1.jpg'
			},
			{ 
			  thumbnail: 'image/path/image2.jpg' 
			},
			{ 
			  thumbnail: 'image/path/image3.jpg' 
			},
			{ 
			  thumbnail: 'image/path/image4.jpg' 
			},
		],
	} );
	</script>
</body>
```
Passing the `items` property in the options object is **mandatory** in this use case. `items` must receive an array of objects (representing images), each with a `thumbnail` property pointing to the image's file path.

### 2. Using HTML markup
The E-Gallery library can read HTML markup and use it to construct the gallery.
The gallery's basic element hierarchy:
-   Container
	-   Item (default selector: `.e-gallery-item`)
		-   Image (default selector: `.e-gallery-image`)

There are two ways to use HTML markup to pass items to the E-Gallery library:
1.  Adding the library's default element class names to your HTML markup
2.  Overwriting the gallery's jQuery selectors with your own selectors

#### 1. Example markup using the library's default class names:
```html
<body>
	<div id="gallery-container">
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
	new EGallery( { container: '#gallery-container' } );
	</script>
</body>
```

It doesn't matter if the `item` and `image` elements have additional classes and attributes, as long as they have the E-Gallery-defined selectors.

#### 2. Overwriting the library's selectors:
```js
new EGallery( {
	container: '#gallery-container',
	selectors: {
		items: 'your-item-selector-here',
		image: 'your-image-selector-here',
	}
} );
```

The values passed to the `items` and `image` properties can be any valid jQuery selectors.
You should only change the jQuery selectors if you use your own HTML markup for the gallery.

## Options

|  Option Property  |                                                                                                                                                                                  Description                                                                                                                                                                                         | Variable Type |                        Default Value                                  |  Is Updatable |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------:|:---------------------------------------------------------------------:|:-------------:|
|     container     | The gallery's container element                                                                                                                                                                                                                                                                                                                                                      |     string    |                                   null                                |      no       |
|        type       | Type of Gallery. Available types: 'grid', 'justified', 'masonry'                                                                                                                                                                                                                                                                                                                     |     string    |                                  'grid'                               |      no       |
|   horizontalGap   | The spacing between gallery columns                                                                                                                                                                                                                                                                                                                                                  |     number    | 5 <br /> (for responsive settings, *see the Breakpoints sub-section*) |      yes      |
|    verticalGap    | The spacing between gallery rows                                                                                                                                                                                                                                                                                                                                                     |     number    | 5 <br /> (for responsive settings, *see the Breakpoints sub-section*) |      yes      |
|      columns      | Number of columns in the gallery. Only available in "Grid" and "Masonry" type galleries                                                                                                                                                                                                                                                                                              |     number    | 5 <br /> (for responsive settings, *see the Breakpoints sub-section*) |      yes      |
|    breakpoints    | Settings for custom breakpoints. Settings that can be configured for different breakpoints: horizontalGap, verticalGap, columns                                                                                                                                                                                                                                                      |     object    |                 *see the Breakpoints sub-section*                     |      yes      |
|       tags        | A comma-separated list of tags attached to image elements. These tags allow real-time filtering of gallery images by tag                                                                                                                                                                                                                                                             |     string    |                                   null                                |      yes      |
|    aspectRatio    | In "Grid" type galleries, the aspect ratio set for the gallery images                                                                                                                                                                                                                                                                                                                |     string    |                                  '16:9'                               |      yes      |
|   idealRowHeight  | In "Justified" type galleries, this variable determines a height (in pixels) to which the library will aim to adjust the row height when positioning the gallery images                                                                                                                                                                                                              |     number    |                                    200                                |      yes      |
|      lastRow      | In "Justified" type galleries, this parameter determines how images are rendered in the last row of the gallery. Options are 'normal' (renders images with the same height as other rows), 'hide' (does not display the last row), and 'fit' (divides the row width between the last row's images. This option might result in much larger image sizes than the rest of the gallery) |     string    |                                 'normal'                              |      yes      |
| animationDuration | The duration of the animation for transition effects, such as the gallery's auto-realignment on resize                                                                                                                                                                                                                                                                               |     number    |                                    0.3s                               |      yes      |
|      classes      | The duration of the animation for transition effects, such as the gallery's auto-realignment on resize                                                                                                                                                                                                                                                                               |     object    |                      *see the Classes sub-section*                    |      no       |
|     selectors     | The duration of the animation for transition effects, such as the gallery's auto-realignment on resize                                                                                                                                                                                                                                                                               |     object    |         { items: '.e-gallery-item', image: 'e-gallery-image' }        |      no       |
|   classesPrefix   | A string prefix to gallery element classes. This parameter is not used when HTML markup is used to pass images to the gallery                                                                                                                                                                                                                                                        |     string    |                                'e-gallery-'                           |      no       |

##### Breakpoints (settings property)

The `breakpoints` parameter accepts an object, in which each breakpoint (in pixels) is a key pointing to a nested object.
The breakpoints object can adjust the values of the `horizontalGap`, `verticalGap` and `columns` settings. 

The following example shows the `breakpoints` object's default values:
```js
new EGallery( {
	container: '#gallery-container',
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
	}
} );
```

##### Classes (settings property)
Default values of the `classes` property object:
```js
{
  container: 'container',
  item: 'item',
  image: 'image',
  overlay: 'overlay',
  overlayTitle: 'overlay__title',
  overlayDescription: 'overlay__description',
  link: 'link',
  firstRowItem: 'first-row-item',
  animated: '-animated',
}
```
## Methods

|                   Method                 |                                                                     Description                                                                   |
|:----------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|
| setSettings(&nbsp;key,&nbsp;value&nbsp;) | Updates the setting passed as the `key` parameter with the value specified in the `value` parameter, and reruns the gallery with the new setting* |
|              runGallery()                | Runs (or re-runs) the gallery setup (not including markup building).                                                                              |
|          getCurrentBreakpoint()          | Returns the breakpoint currently used by the gallery                                                                                              |
|            getActiveItems()              | Returns the currently displayed items                                                                                                             |

\* See the "Options" section above for information on which settings can be updated

## The jQuery Plugin
To use E-Gallery as a jQuery plugin, include the `jquery-e-gallery.js` file in your project **in place of** the `e-gallery.js` file.

#### Usage
Call the `.eGallery()` method on the gallery container's jQuery object, passing in the options object:
```html
<body>
	<div id="#gallery-container"></div>
	<script>
	jQuery( '#gallery-container' ).eGallery( {options} );
	</script>
</body>
```
