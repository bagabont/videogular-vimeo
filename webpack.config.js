var webpack = require("webpack");

module.exports = {
  entry: {
    'vg-vimeo': './src/vg-vimeo.js',
    'vg-vimeo.min': './src/vg-vimeo.js'
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  resolve: {
    modulesDirectories: ["node_modules", "bower_components"]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    )
  ]
};