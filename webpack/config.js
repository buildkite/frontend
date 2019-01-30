const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Ensure a NODE_ENV is also present
if (!process.env.NODE_ENV) {
  throw "No NODE_ENV set";
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
const filenameFormat = IS_PRODUCTION ? "[name]-[chunkhash]" : "[name]";
const chunkFilenameFormat = IS_PRODUCTION ? "[chunkhash].chunk" : "[name].chunk";

// Toggle between the devtool if on prod/dev since inline-cheap-source-map
// is way faster for development.
const devTool = IS_PRODUCTION ? "source-map" : "inline-cheap-source-map";

var plugins = [
  // Add the 'whatwg-fetch' polyfill in case the browser doesn't support it
  new webpack.ProvidePlugin({ 'fetch': ['babel-loader!whatwg-fetch', 'fetch'] }),

  // After Webpack compilation, spit out a 'manifest.json' file with a mapping
  // of file name, to compiled name.
  new AssetsPlugin({
    path: path.join(__dirname, '..', 'dist'),
    filename: 'manifest.json'
  }),

  // Ensures only moments "en" package is included (saves 200kb in final compilation)
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),

  new MiniCssExtractPlugin({
    filename: `${filenameFormat}.css`,
    chunkFilename: `${chunkFilenameFormat}.css`
  })
];

// If we're building for production, minify the JS
if (IS_PRODUCTION) {
  // Don't pack react-type-snob in production
  plugins.push(new webpack.IgnorePlugin(/^react-type-snob$/));
}

if (process.env.GENERATE_BUNDLE_REPORT === 'true') {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../bundle-analysis/bundle-analyzer-report.html',
    openAnalyzer: false
  }));
}

module.exports = {
  context: __dirname,

  mode: IS_PRODUCTION ? 'production' : 'development',

  devtool: devTool,

  devServer: {
    allowedHosts: [
      'buildkite.localhost'
    ],
    headers: {
      'Access-Control-Allow-Origin': 'http://buildkite.localhost'
    }
  },

  entry: {
    app: path.join(__dirname, '../app/app.js')
  },

  output: {
    filename: `${filenameFormat}.js`,
    chunkFilename: `${chunkFilenameFormat}.js`,
    path: path.join(__dirname, '..', 'dist')
  },

  resolve: {
    alias: {
      app: path.resolve(__dirname, '../app')
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,

        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial'
        },

        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        },

        emoji: {
          name: 'emoji',
          test: /[\\/]vendor\/emojis[\\/]/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.flow$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.css$/i,
        use: [
          (IS_PRODUCTION
            ? { loader: MiniCssExtractPlugin.loader }
            : {
              loader: 'style-loader',
              options: {
                singleton: true
              }
            }),
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
