var webpack = require('webpack');

module.exports = {  
  entry: './src/FrontEnd/main.tsx',
  output: {
    path: './public/js/',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    alias: {
        jszip: "./bower_components/jszip/dist/jszip.min.js",
        highcharts:"./bower_components/highcharts/highcharts.js",
        RecordRTC:"./bower_components/recordrtc/RecordRTC.min.js",
        aes:"./bower_components/aes/aes.js",
        JVision:"./bower_components/ciweb/min/JVision.js"
    }
  },
  // devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ],
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