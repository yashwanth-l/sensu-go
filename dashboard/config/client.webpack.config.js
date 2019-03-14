import fs from "fs";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

const root = fs.realpathSync(process.cwd());
const outputPath = path.join(root, "build", "client");

export default makeConfig({
  entry: {
    client: [path.join(root, "src/client")],
  },

  output: {
    path: path.join(outputPath, "public"),
  },

  plugins: [
    new CleanPlugin(outputPath, { root }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(root, "src/client/static/index.html"),
      minify: process.env.NODE_ENV !== "development" && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DllReferencePlugin({
      manifest: path.join(root, "build/lib/dll.json"),
    }),
  ],
});
