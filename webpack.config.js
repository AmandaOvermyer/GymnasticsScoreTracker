var path = require('path');

var webpack = require('webpack');
console.log(path.resolve(__dirname, 'public/js/index.js'));
module.exports = {
	entry: path.resolve(__dirname, 'public/js/index.js'),
	output: {
		path: path.resolve(__dirname, 'public/build'),
		filename: 'app.js'
	},

	module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
}