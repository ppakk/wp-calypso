/***** WARNING: No ES6 modules here. Not transpiled! *****/

/**
 * External dependencies
 */
const webpack = require( 'webpack' ),
	path = require( 'path' );

/**
 * Internal dependencies
 */
const config = require( './server/config' ),
	cacheIdentifier = require( './server/bundler/babel/babel-loader-cache-identifier' ),
	ChunkFileNamePlugin = require( './server/bundler/plugin' ),
	CopyWebpackPlugin = require( 'copy-webpack-plugin' ),
	HardSourceWebpackPlugin = require( 'hard-source-webpack-plugin' ),
	WebpackStableBuildPlugin = require( './server/bundler/webpack/stable-build-plugin' );

/**
 * Internal variables
 */
const calypsoEnv = config( 'env_id' );

const bundleEnv = config( 'env' );

const webpackConfig = {
	bail: calypsoEnv !== 'development',
	cache: true,
	entry: {},
	devtool: '#eval',
	output: {
		path: path.join( __dirname, 'public' ),
		publicPath: '/calypso/',
		filename: '[name].[chunkhash].js', // prefer the chunkhash, which depends on the chunk, not the entire build
		chunkFilename: '[name].[chunkhash].js', // ditto
		devtoolModuleFilenameTemplate: 'app:///[resource-path]'
	},
	module: {
		// avoids this warning:
		// https://github.com/localForage/localForage/issues/577
		noParse: /[\/\\]node_modules[\/\\]localforage[\/\\]dist[\/\\]localforage\.js$/,
		rules: [
			{
				test: /extensions[\/\\]index/,
				exclude: path.join( __dirname, 'node_modules' ),
				loader: path.join( __dirname, 'server', 'bundler', 'extensions-loader' )
			},
			{
				test: /sections.js$/,
				exclude: path.join( __dirname, 'node_modules' ),
				loader: path.join( __dirname, 'server', 'bundler', 'loader' )
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				include: require.resolve( 'tinymce/tinymce' ),
				loader: 'exports-loader',
				query: {
					window: 'tinymce'
				}
			},
			{
				include: /node_modules[\/\\]tinymce/,
				loader: 'imports-loader',
				query: {
					'this': 'window'
				}
			}
		]
	},
	resolve: {
		extensions: [ '.json', '.js', '.jsx' ],
		modules: [
			path.join( __dirname, 'client' ),
			path.join( __dirname, 'client', 'extensions' ),
			'node_modules',
		],
		alias: {
			'react-virtualized': 'react-virtualized/dist/commonjs',
			'social-logos/example': 'social-logos/build/example'
		}
	},
	node: {
		console: false,
		process: true,
		global: true,
		Buffer: true,
		__filename: 'mock',
		__dirname: 'mock',
		fs: 'empty'
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env': {
				NODE_ENV: JSON.stringify( bundleEnv )
			},
			'PROJECT_NAME': JSON.stringify( config( 'project' ) )
		} ),
		new WebpackStableBuildPlugin( {
			seed: 0
		} ),
		new webpack.IgnorePlugin( /^props$/ ),
		new CopyWebpackPlugin( [ { from: 'node_modules/flag-icon-css/flags/4x3', to: 'images/flags' } ] )
	],
	externals: [ 'electron' ]
};

if ( calypsoEnv === 'desktop' ) {
	// no chunks or dll here, just one big file for the desktop app
	webpackConfig.output.filename = '[name].js';
} else {
	// vendor chunk
	webpackConfig.entry.vendor = [
		'classnames',
		'i18n-calypso',
		'moment',
		'page',
		'react',
		'react-dom',
		'react-redux',
		'redux',
		'redux-thunk',
		'store',
		'wpcom',
	];

	webpackConfig.plugins.push(
		new webpack.optimize.CommonsChunkPlugin( {
			name: 'vendor',
			filename: 'vendor.[chunkhash].js',
		} )
	);

	// slight black magic here. 'manifest' is a secret webpack module that includes the webpack loader and
	// the mapping from module id to path.
	//
	// We extract it to prevent build-$env chunk from changing when the contents of a child chunk change.
	//
	// See https://github.com/webpack/webpack/issues/1315 for some backgroud. Guidance here taken from
	// https://github.com/webpack/webpack/issues/1315#issuecomment-158530525.
	//
	// Our hashes will still change when modules are added or removed, but many of our deploys don't
	// involve module structure changes, so this should at least help in many cases.
	webpackConfig.plugins.push(
		new webpack.optimize.CommonsChunkPlugin( {
			name: 'manifest',
			// have to use [hash] here instead of [chunkhash] because this is an entry chunk
			filename: 'manifest.[hash].js'
		} )
	);

	// Somewhat badly named, this is our custom chunk loader that knows about sections
	// and our loading notification infrastructure
	webpackConfig.plugins.push( new ChunkFileNamePlugin() );

	// jquery is only needed in the build for the desktop app
	// see electron bug: https://github.com/atom/electron/issues/254
	webpackConfig.externals.push( 'jquery' );
}

const jsRules = {
	test: /\.jsx?$/,
	exclude: /node_modules[\/\\](?!notifications-panel)/,
	loader: [ {
		loader: 'babel-loader',
		options: {
			cacheDirectory: './.babel-cache',
			cacheIdentifier: cacheIdentifier,
			plugins: [ [
				path.join( __dirname, 'server', 'bundler', 'babel', 'babel-plugin-transform-wpcalypso-async' ),
				{ async: config.isEnabled( 'code-splitting' ) }
			] ]
		}
	} ]
};

if ( calypsoEnv === 'development' ) {
	const DashboardPlugin = require( 'webpack-dashboard/plugin' );
	webpackConfig.plugins.splice( 0, 0, new DashboardPlugin() );
	webpackConfig.plugins.push( new webpack.HotModuleReplacementPlugin() );
	webpackConfig.entry.build = [
		'webpack-hot-middleware/client',
		path.join( __dirname, 'client', 'boot', 'app' )
	];

	if ( config.isEnabled( 'use-source-maps' ) ) {
		webpackConfig.devtool = '#eval-cheap-module-source-map';
		webpackConfig.module.rules.push( {
			test: /\.jsx?$/,
			enforce: 'pre',
			loader: 'source-map-loader'
		} );
	}
} else {
	webpackConfig.plugins.push( new webpack.LoaderOptionsPlugin( { debug: false } ) );
	webpackConfig.entry.build = path.join( __dirname, 'client', 'boot', 'app' );
	webpackConfig.devtool = false;
}

if ( calypsoEnv === 'production' ) {
	webpackConfig.plugins.push( new webpack.NormalModuleReplacementPlugin(
		/^debug$/,
		path.join( __dirname, 'client', 'lib', 'debug-noop' )
	) );
}

if ( ! config.isEnabled( 'desktop' ) ) {
	webpackConfig.plugins.push( new webpack.NormalModuleReplacementPlugin( /^lib[\/\\]desktop$/, 'lodash/noop' ) );
}

if ( config.isEnabled( 'webpack/persistent-caching' ) ) {
	webpackConfig.recordsPath = path.join( __dirname, '.webpack-cache', 'client-records.json' );
	webpackConfig.plugins.unshift( new HardSourceWebpackPlugin( { cacheDirectory: path.join( __dirname, '.webpack-cache', 'client' ) } ) );
}

webpackConfig.module.rules = [ jsRules ].concat( webpackConfig.module.rules );

if ( process.env.WEBPACK_OUTPUT_JSON ) {
	webpackConfig.devtool = 'cheap-module-source-map';
	webpackConfig.plugins.push( new webpack.optimize.UglifyJsPlugin( {
		minimize: true,
		compress: {
			warnings: false,
			conditionals: true,
			unused: true,
			comparisons: true,
			sequences: true,
			dead_code: true,
			evaluate: true,
			if_return: true,
			join_vars: true,
			negate_iife: false,
			screw_ie8: true
		},
		sourceMap: true
	} ) );
}

module.exports = webpackConfig;
