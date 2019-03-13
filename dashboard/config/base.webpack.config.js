import fs from "fs";
import path from "path";
import webpack from "webpack";
import eslintFormatter from "react-dev-utils/eslintFormatter";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

const PRODUCTION = "production";
const DEVELOPMENT = "development";

const root = fs.realpathSync(process.cwd());

export default ({
  mode = process.env.NODE_ENV !== PRODUCTION ? DEVELOPMENT : PRODUCTION,
  chunkName = mode !== PRODUCTION ? "[name]" : "[name].[chunkHash:8]",
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

  entry: {
    ...entry,
  },

  output: {
    filename: `${chunkName}.js`,
    chunkFilename: `${chunkName}.js`,
    library: chunkName,
    pathinfo: mode !== PRODUCTION,
    ...output,
  },

  optimization: {
    splitChunks: { minChunks: 2 },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
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
        test: /\.(js|jsx)$/,
        exclude: path.resolve(root, "node_modules"),
        use: [
          {
            loader: require.resolve("eslint-loader"),
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve("eslint"),
              emitError: false,
              emitWarning: mode !== PRODUCTION,
            },
          },
        ],
      },
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
              filename: `static/media/${chunkName}.[ext]`,
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
              compact: mode === PRODUCTION,
              cacheDirectory: mode !== PRODUCTION,
            },
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: `static/media/${chunkName}.[ext]`,
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
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),

    new webpack.ProvidePlugin({
      // Alias any reference to global Promise object to bluebird.
      Promise: require.resolve("bluebird/js/browser/bluebird.core.js"),
    }),

    // Generates an `index.html` file with the <script> injected.
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   template: path.resolve(root, "src/static/index.html"),
    //   minify: mode === PRODUCTION && {
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
    new webpack.HashedModuleIdsPlugin(),
  ]
    .concat(
      mode !== PRODUCTION && [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
      ],
    )
    .concat(plugins)
    .filter(Boolean),

  ...config,
});
