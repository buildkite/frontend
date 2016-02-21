var path = require("path");
var webpack = require("webpack");
var AssetsPlugin = require('assets-webpack-plugin');

// Ensure a WEBPACK_HOST is setup since we embed it in the assets.json file
if(!process.env.WEBPACK_HOST) {
  throw "No WEBPACK_HOST set";
}

// The WEBPACK_HOST must end with a /
if(process.env.WEBPACK_HOST.slice(-1) != "/") {
  throw "WEBPACK_HOST must end with a /";
}

// Include a hash of the bundle in the name when we're building these files for
// production so we can use non-expiring caches for them.
//
// Also, if we used hashes in development, we'd be forever filling up our dist
// folder with every hashed version of files we've changed (webpack doesn't
// clean up after itself)
var filenameFormat
if(process.env.NODE_ENV == "production") {
  filenameFormat = "[name]-[hash].js"
} else {
  filenameFormat = "[name].js"
}

// Toggle between the devtool if on prod/dev since cheap-module-eval-source-map
// is way faster for development.
var devTool
if(process.env.NODE_ENV == "production") {
  devTool = "source-map"
} else {
  devTool = "cheap-module-eval-source-map"
}

var plugins = [
  new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
  new webpack.optimize.CommonsChunkPlugin("vendor", filenameFormat),
  new AssetsPlugin({ path: path.join(__dirname, '..', 'dist'), filename: 'assets.json' })
]

// If we're building for production, minify the JS
if(process.env.NODE_ENV == "production") {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
  context: __dirname,

  devtool: devTool,

  entry: {
    app: path.join(__dirname, './../app/app.js'),
    vendor: ["classnames", "react", "react-dom", "react-relay", "react-router", "react-router-relay", "history", "graphql", "graphql-relay", "moment", "object-assign", "dom-align", "eventemitter3", "pusher-js"]
  },

  output: {
    filename: filenameFormat,
    path: path.join(__dirname, '..', 'dist'),
    publicPath: process.env.WEBPACK_HOST
  },

  module: {
    loaders: [
      {
        test: /\.css$/i,
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.js$/i,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(woff)$/i,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        loaders: [
          'url-loader?limit=8192',
          'image-webpack?optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  plugins: plugins,

  postcss: function (webpack) {
    return [
      require("postcss-import")({ addDependencyTo: webpack }),
      // require("postcss-url")(),
      require("postcss-cssnext")({ features: { rem: false } }),
      require('postcss-easings')(),
      // add your "plugins" here
      // ...
      // and if you want to compress,
      // just use css-loader option that already use cssnano under the hood
      require("postcss-browser-reporter")(),
      require("postcss-reporter")()
    ]
  }
}
