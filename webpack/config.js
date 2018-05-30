const path = require("path");
const webpack = require("webpack");
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const RelayCompilerPlugin = require('relay-compiler-webpack-plugin');

// Ensure a FRONTEND_HOST is setup since we embed it in the assets.json file
if (!process.env.FRONTEND_HOST) {
  throw "No FRONTEND_HOST set";
}

// Ensure a NODE_ENV is also present
if (!process.env.NODE_ENV) {
  throw "No NODE_ENV set";
}

// The FRONTEND_HOST must end with a /
if (process.env.FRONTEND_HOST.slice(-1) !== "/") {
  throw "FRONTEND_HOST must end with a /";
}

// Ensure a EMOJI_HOST is setup since we need it for emoji
if (!process.env.EMOJI_HOST) {
  throw "No EMOJI_HOST set";
}

const IS_PRODUCTION = (process.env.NODE_ENV === "production");

// Include a hash of the bundle in the name when we're building these files for
// production so we can use non-expiring caches for them.
//
// Also, if we used hashes in development, we'd be forever filling up our dist
// folder with every hashed version of files we've changed (webpack doesn't
// clean up after itself)
const filenameFormat = IS_PRODUCTION ? "[name]-[chunkhash].js" : "[name].js";
const chunkFilename = IS_PRODUCTION ? "[chunkhash].chunk.js" : "[name].chunk.js";

// Toggle between the devtool if on prod/dev since inline-cheap-source-map
// is way faster for development.
const devTool = IS_PRODUCTION ? "source-map" : "inline-cheap-source-map";

var plugins = [
  // Forked version of the RelayCompilerWebpackPlugin that supports
  // relay-compiler 1.1.0
  new RelayCompilerPlugin({
    schema: path.join(__dirname, '../app/graph/schema.json'),
    src: path.resolve(__dirname, '../app')
  }),

  // Only add the 'whatwg-fetch' plugin if the browser doesn't support it
  new webpack.ProvidePlugin({ 'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch' }),

  // Split emojis, vendor javascript up. The loader JS doesn't have any modules
  // inside it, but since it's the last one, that's where Webpack will dump all
  // of it's bootstrapping JS. This file will change on every compilation.
  new webpack.optimize.CommonsChunkPlugin({
    names: ["emojis", "vendor", "loader"],
    minChunks: 2
  }),


  // After Webpack compilation, spit out a 'manifest.json' file with a mapping
  // of file name, to compiled name.
  new AssetsPlugin({
    path: path.join(__dirname, '..', 'dist'),
    filename: 'manifest.json'
  }),

  // By default, Webpack uses numerical ID's for it's internal module
  // identification. When you add a module, everything gets shift by 1, which
  // means you end up having a different 'vendor.js' file, if you changed a
  // module in 'app.js', since all the ID's are now +1. NamedModulesPlugin uses
  // the name of the plugin instead of a id, the only problem with this, is
  // that it bloats file size, because instead of "1" being the ID, it's now
  // "../../node_modules/react/index.js" or something. In saying that though,
  // after gzipping, it's not a real problem.
  new webpack.NamedModulesPlugin(),

  // Ensures only moments "en" package is included (saves 200kb in final compilation)
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),

  // When you set NODE_ENV=production, that only sets it for the Webpack NodeJS
  // environment. We need to also send the variable to the JS compilation
  // inside Babel, so packages like React know now to include development
  // helpers. Doing this greatly reduces file size, and makes React faster
  // since it doesn't have to do a ton of type checking (which it only does to
  // help developers with error messages)
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),

  new ExtractTextPlugin("[name]-[contenthash].css")
];

var vendor_modules = [
  "autosize",
  "babel-polyfill",
  "bugsnag-js",
  "bugsnag-react",
  "buffer-crc32",
  "classnames",
  "create-react-class",
  "credit-card-type",
  "decode-uri-component",
  "deepmerge",
  "es6-error",
  "escape-html",
  "eventemitter3",
  "fetch-jsonp",
  "global",
  "graphql",
  "graphql-relay",
  "history",
  "metrick",
  "mojibaka",
  "moment",
  "moment-duration-format",
  "object-assign",
  "pusher-js",
  "query-string",
  "react",
  "react-addons-pure-render-mixin",
  "react-addons-shallow-compare",
  "react-addons-update",
  "react-confetti",
  "react-document-title",
  "react-dom",
  "react-relay",
  "react-relay/classic",
  "react-relay/compat",
  "react-router",
  "react-router-relay",
  "react-transition-group",
  "search-query-parser",
  "shuffle-array",
  "styled-components",
  "throttleit",
  "uuid",
  "whatwg-fetch"
];

// If we're building for production, minify the JS
if (IS_PRODUCTION) {
  // Don't pack react-type-snob in production
  plugins.push(new webpack.IgnorePlugin(/^react-type-snob$/));

  // Your basic, run-of-the-mill, JS uglifier
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    parallel: true,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      screw_ie8: true
    }
  }));
}

if (process.env.COLLECT_BUNDLE_STATS === 'true') {
  var StatsPlugin = require('stats-webpack-plugin');
  plugins.push(new StatsPlugin('../bundle-analysis/stats.json'));
}

module.exports = {
  context: __dirname,

  devtool: devTool,

  devServer: {
    headers: { "Access-Control-Allow-Origin": "http://buildkite.localhost" }
  },

  entry: {
    vendor: vendor_modules,
    emojis: [path.join(__dirname, '../app/emoji/buildkite.js'), path.join(__dirname, '../app/emoji/apple.js')],
    app: path.join(__dirname, '../app/app.js'),
    public: path.join(__dirname, '../app/public.js')
  },

  output: {
    filename: filenameFormat,
    chunkFilename: chunkFilename,
    path: path.join(__dirname, '..', 'dist'),
    publicPath: process.env.FRONTEND_HOST
  },

  module: {
    rules: [
      {
        test: /\.flow$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.css$/i,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          filename: filenameFormat,
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: IS_PRODUCTION,
                sourceMap: !IS_PRODUCTION
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: function() {
                  return [
                    require("postcss-import")(),
                    require("postcss-cssnext")({ features: { rem: false } }),
                    require('postcss-easings')(),
                    require("postcss-browser-reporter")(),
                    require("postcss-reporter")()
                  ];
                }
              }
            }
          ]
        })
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.mdx$/i,
        use: [
          { loader: 'babel-loader' },
          { loader: 'markdown-component-loader', options: { passElementProps: true } }
        ]
      },
      {
        test: /\.(woff)$/i,
        use: [
          { loader: 'url-loader', options: { limit: 8192 } }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: [
          { loader: 'url-loader', options: { limit: 8192 } },
          {
            loader: 'image-webpack-loader',
            options: {
              optipng: { optimizationLevel: 7 },
              gifsicle: { interlaced: false }
            }
          }
        ]
      }
    ]
  },

  plugins: plugins
};
