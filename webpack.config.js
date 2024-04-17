const path = require('path');

module.exports = {
	mode: "development",
	entry: {
		index: {
			import: './src/index.js',
			dependOn: ['phaser', 'knobs'],
		},
		phaser: 'phaser',
		knobs: '@yaireo/knobs'
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