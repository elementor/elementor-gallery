const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ),
	merge = require( 'webpack-merge' ),
	mode = process.env.NODE_ENV || 'development';

const devConfig = {
	devtool: 'source-map',
};

const productionConfig = {};

const fileSuffix = 'development' === mode ? '' : '.min';

const commonConfig = {
	mode,
	entry: {
		eGallery: './src/js/eGallery.js',
		'jquery-eGallery': './src/js/jquery-eGallery.js',
	},
	output: {
		path: __dirname + '/dist/js',
		filename: '[name]' + fileSuffix + '.js',
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: '../css/eGallery' + fileSuffix + '.css',
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

module.exports = merge( commonConfig, 'development' === mode ? devConfig : productionConfig );
