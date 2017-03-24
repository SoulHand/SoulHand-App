var webpack = require('webpack');

module.exports = {  
  entry: './src/FrontEnd/main.tsx',
  output: {
    path: './public/js/',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modulesDirectories: ['src/FrontEnd', 'node_modules'],
  },
  // devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },/*
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router": "ReactRouter"
  },*/
  plugins: [
    new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery",
       Tether:"tether",
       React: "react",
       ReactDOM: "react-dom",
       ReactRouter: "react-router"
    }),
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.DefinePlugin({
        NODE_ENV: 'development'
    })/*,
     new BowerWebpackPlugin({
      modulesDirectories: ["bower_components"],
      manifestFiles:      "bower.json",
      includes:           "/.*\/",
      excludes:           [],
      searchResolveModulesDirectories: true
    })*/   
  ]
}