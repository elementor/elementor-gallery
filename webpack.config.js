const webpack = require( 'webpack' ),
	pkg = require( './package.json' );

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ),
	merge = require( 'webpack-merge' ),
	mode = process.env.NODE_ENV || 'development',
	fileSuffix = 'development' === mode ? '' : '.min';

const commonConfig = {
	mode,
	devtool: 'development' === mode ? 'source-map' : '',
	output: {
		path: __dirname + '/dist/js',
		devtoolModuleFilenameTemplate: '../../[resource]',
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: '../css/e-gallery' + fileSuffix + '.css',
		} ),
		new webpack.BannerPlugin( {
			banner: `E-Gallery v${ pkg.version } by Elementor`,
		} ),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				loader: 'eslint-loader',
				options: {
					failOnError: true,
				},
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ],
				},
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							data: '$prefix: e-gallery;',
						},
					},
				],
			},
		],
	},
};

const libraryConfig = {
	entry: './src/js/e-gallery.js',
	output: {
		filename: `e-gallery${ fileSuffix }.js`,
		library: 'EGallery',
		libraryExport: 'default',
	},
};

const jQueryConfig = {
	entry: './src/js/jquery-e-gallery.js',
	output: {
		filename: `jquery-e-gallery${ fileSuffix }.js`,
	},
};

module.exports = [ merge( commonConfig, libraryConfig ), merge( commonConfig, jQueryConfig ) ];
