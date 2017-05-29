var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    app: './src/FrontEnd/main.tsx',
    style: './src/FrontEnd/scss/soulhand.scss'
  },
  output: {
    path: path.join(__dirname, '/public/js/'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modulesDirectories: ['src/FrontEnd', 'node_modules']
  },
  // devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.tsx?$/, loader: 'ts-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      validator: 'string-validator',
      jQuery: 'jquery',
      Tether: 'tether',
      React: 'react',
      ReactDOM: 'react-dom',
      ReactRouter: 'react-router',
      'window.settings': path.join(__dirname, 'src/FrontEnd/settings.js')
    }),
    new webpack.DefinePlugin({
      NODE_ENV: 'development'
    })
  ]
}
// new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
/*
new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}),
 new BowerWebpackPlugin({
  modulesDirectories: ["bower_components"],
  manifestFiles:      "bower.json",
  includes:           "/.*\/",
  excludes:           [],
  searchResolveModulesDirectories: true
}) */
