var webpack = require('webpack');

module.exports = {  
  entry: './src/FrontEnd/main.tsx',
  output: {
    path: './public/js/',
    filename: 'build.js'
  },  
  // devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  },
  externals: {
    JVision:"JVision"
    /*
    jquery: {
        root: 'jquery',
        commonjs2: 'jquery',
        commonjs: 'jquery',
        amd: 'jquery',
    },
    react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
    },
    'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
    }
    'react-router': {
        root: 'ReactRouter',
        commonjs2: 'react-router',
        commonjs: 'react-router',
        amd: 'react-router',
    }*/
  },
  plugins: [
    new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery",
       Tether:"tether"
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
  ],
}