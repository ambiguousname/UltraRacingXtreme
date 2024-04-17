const path = require('path');

module.exports = {
	mode: "development",
	entry: {
		index: {
			import: './src/index.ts',
			dependOn: ['phaser', 'knobs'],
		},
		phaser: 'phaser',
		knobs: '@yaireo/knobs'
	},
	module: {
		rules: [
			{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	cache: {
		type: 'filesystem',
	},
	optimization: {
		runtimeChunk: 'single',
	},
	watch: true,
};