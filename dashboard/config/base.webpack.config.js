import fs from "fs";
import path from "path";
import webpack from "webpack";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
// import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const root = fs.realpathSync(process.cwd());

export default ({
  mode = process.env.NODE_ENV,
  chunkName = mode === "development" ? "[name]" : "[name]_[chunkhash:8]",
  fileName = mode === "development" ? "[name]" : "[name]_[contenthash:8]",
  context,
  entry,
  output,
  plugins,
  module: { rules = [], ...module } = {},
  target = "web",
  ...config
}) => ({
  context: root,
  bail: true,
  target,
  mode,
  devtool: mode === "development" ? "eval" : "nosources-source-map",

  entry: {
    ...entry,
  },

  output: {
    filename: `${fileName}.js`,
    chunkFilename: `${chunkName}.js`,
    library: chunkName,
    pathinfo: mode === "development",
    ...output,
  },

  optimization: {
    splitChunks: { minChunks: 2 },
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          // Disable function name minification in order to preserve class
          // names. This makes tracking down bugs in production builds far
          // more manageable.
          keep_fnames: true,
        },
      }),
    ],
  },

  resolve: {
    extensions: [".web.js", ".js", ".json", ".web.jsx", ".jsx"],
    alias: {
      // Alias any reference to babel runtime Promise to bluebird. This
      // prevents duplicate promise polyfills in the build.
      "babel-runtime/core-js/promise": "bluebird/js/browser/bluebird.core.js",
    },
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        include: path.resolve(root, "node_modules"),
        exclude: [path.resolve(root, "node_modules/apollo-client")],
        loader: require.resolve("source-map-loader"),
        options: {
          includeModulePaths: true,
        },
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              filename: `static/media/${fileName}.[ext]`,
            },
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.worker\.js$/,
            loader: "worker-loader",
            options: {
              name: "static/[hash].worker.js",
            },
          },
          {
            test: /\.macro\.js$/,
            exclude: path.resolve(root, "node_modules"),
            loaders: [
              require.resolve("./macroLoader"),
              require.resolve("value-loader"),
            ],
          },
          {
            test: /\.(js|jsx)$/,
            exclude: path.resolve(root, "node_modules"),
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: mode === "development",
            },
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: `static/media/${fileName}.[ext]`,
            },
          },
          {
            test: /\.html$/,
            loader: require.resolve("raw-loader"),
          },
        ],
      },
      ...rules,
    ],
    ...module,
  },

  plugins: [
    // new CleanPlugin([outputPath, path.resolve(outputPath, "../stats.json")], {
    //   root,
    //   verbose: false,
    // }),
    new webpack.ProvidePlugin({
      // Alias any reference to global Promise object to bluebird.
      Promise: require.resolve("bluebird/js/browser/bluebird.core.js"),
    }),
    // Generates an `index.html` file with the <script> injected.
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   template: path.resolve(root, "src/static/index.html"),
    //   minify: mode !== "development" && {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeRedundantAttributes: true,
    //     useShortDoctype: true,
    //     removeEmptyAttributes: true,
    //     removeStyleLinkTypeAttributes: true,
    //     keepClosingSlash: true,
    //     minifyJS: true,
    //     minifyCSS: true,
    //     minifyURLs: true,
    //   },
    // }),
    // Remove moment locales.
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new webpack.NamedChunksPlugin(),
  ]
    .concat(
      mode !== "development" && [
        // Use hashed module ids in production builds
        new webpack.HashedModuleIdsPlugin(),
      ],
    )
    .concat(
      mode === "development" && [
        new CaseSensitivePathsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ],
    )
    .concat(plugins)
    .filter(Boolean),

  ...config,
});
