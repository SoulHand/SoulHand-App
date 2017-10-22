var webpack = require('webpack')
var path = require('path')
const marked = require("marked");
const renderer = new marked.Renderer();

module.exports = {
  entry: {
    app: './src/FrontEnd/js/main.tsx',
    style: './src/FrontEnd/css/index.less'
  },
  output: {
    path: path.join(__dirname, '/public/'),
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
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.less$/, loader: 'style!css!less',
        options: { importLoaders: 1 }},
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.(gif|png|jpeg|jpg)$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.md$/,
        loader: "html-loader!markdown-loader",
        options: {
          pedantic: true,
          renderer
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      "window.$": 'jquery',
      validator: 'string-validator',
      jQuery: 'jquery',
      Tether: 'tether',
      React: 'react',
      ReactDOM: 'react-dom',
      ReactRouter: 'react-router',
      'window.settings': path.join(__dirname, 'src/FrontEnd/settings.js'),
      "LICENSE": path.join(__dirname, 'LICENSE.md'),
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
