var path = require("path");
var webpack = require("webpack");
var AssetsPlugin = require('assets-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

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
var chunkFilename
if(process.env.NODE_ENV == "production") {
  filenameFormat = "[name]-[chunkhash].js"
  chunkFilename = "[id]-[chunkhash].js"
} else {
  filenameFormat = "[name].js"
  chunkFilename = "[id].js"
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
  new WebpackMd5Hash(),
  new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
  new webpack.optimize.CommonsChunkPlugin({ names: [ "emojis", "vendor", "manifest" ] }),
  new AssetsPlugin({ path: path.join(__dirname, '..', 'dist'), filename: 'assets.json' })
]

// If we're building for production, minify the JS
if(process.env.NODE_ENV == "production") {
  // Need this plugin to ensure consistent module ordering so we can have determenistic filename hashes
  plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      screw_ie8: true
    }
  }));
}

module.exports = {
  context: __dirname,

  devtool: devTool,

  entry: {
    vendor: ["classnames", "react", "react-dom", "react-relay", "react-router",
      "react-router-relay", "history", "graphql", "graphql-relay",
      "moment", "object-assign", "eventemitter3", "pusher-js",
      "whatwg-fetch", "es6-error", "escape-html", "react-addons-update",
      "react-document-title", "bugsnag-js", "deepmerge"],
    emojis: [ path.join(__dirname, './../app/emojis/buildkite.js'), path.join(__dirname, './../app/emojis/apple.js') ],
    app: path.join(__dirname, './../app/app.js')
  },

  output: {
    filename: filenameFormat,
    chunkFilename: chunkFilename,
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
