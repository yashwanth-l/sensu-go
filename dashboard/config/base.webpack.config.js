import fs from "fs";
import path from "path";
import webpack from "webpack";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const root = fs.realpathSync(process.cwd());

const isDevMode = mode => mode === "development";

export default ({
  mode = process.env.NODE_ENV,

  // Include a hash of each file's content in its name unless running a
  // development build. This ensures browser caches are automatically invalided
  // by newer asset versions. We avoid using [hash] here since it represents
  // a hash of the entire build, and not of each individual file. Using it would
  // cause a update to any file in the build to change the name of all files,
  // even ones that that didn't change from the previous build.
  contentHashName = isDevMode(mode) ? "[name]" : "[name]_[contenthash:4]",
  chunkHashName = isDevMode(mode) ? "[name]" : "[name]_[chunkhash:4]",

  // file-loader calculates hashes differently from the rest of webpack
  // [hash] in file loader is equivalent to [contenthash] elsewhere
  // see: https://github.com/webpack-contrib/file-loader#placeholders
  fileLoaderHashName = isDevMode(mode) ? "[name]" : "[name]_[hash:4]",

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
  entry,

  // Emit source maps in production builds that include only the line and
  // filename mapping. This reduces the source map file size considerably and
  // preserves the obfuscation of the original source.
  devtool: isDevMode(mode) ? "eval" : "nosources-source-map",

  output: {
    filename: `${contentHashName}.js`,
    chunkFilename: `${chunkHashName}.js`,
    library: chunkHashName,
    pathinfo: isDevMode(mode),
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
          // more manageable at the expense of slightly larger (about 15%)
          // compressed bundle sizes.
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
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.worker\.js$/,
            loader: "worker-loader",
            options: {
              name: `${contentHashName}.js`,
            },
          },
          {
            test: /\.macro\.js$/,
            exclude: path.resolve(root, "node_modules"),
            loaders: [
              {
                loader: require.resolve("./macroLoader"),
                options: {
                  filename: `${fileLoaderHashName}.[ext]`,
                },
              },
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
              name: `${fileLoaderHashName}.[ext]`,
            },
          },
          {
            test: /\.html$/,
            loader: require.resolve("html-loader"),
            options: {
              interpolate: true,
            },
          },
        ],
      },
      ...rules,
    ],
    ...module,
  },

  plugins: [
    new webpack.ProvidePlugin({
      // Alias any reference to global Promise object to bluebird.
      Promise: require.resolve("bluebird/js/browser/bluebird.core.js"),
    }),
    // Prevent moment locales from getting bundled.
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
    .concat(
      !isDevMode(mode) && [
        // Use hashed module ids in production builds.
        new webpack.HashedModuleIdsPlugin(),
      ],
    )
    .concat(
      isDevMode(mode) && [
        new CaseSensitivePathsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ],
    )
    .concat(plugins)
    .filter(Boolean),

  ...config,
});
