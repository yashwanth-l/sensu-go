import fs from "fs";
import path from "path";

import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

const root = fs.realpathSync(process.cwd());
const outputPath = path.join(root, "build", "lib");

const lib = (...args) => path.join(root, "src", "lib", ...args);

export default makeConfig({
  entry: {
    lib: [
      lib("polyfill"),
      "react",
      "react-dom",
      "react-router-dom",
      "graphql-tag",
      "react-apollo",
      "@material-ui/core",
      "react-resize-observer",
      "prop-types",
      "classnames",
      "react-spring",
      "fbjs",
    ],
  },

  output: {
    path: outputPath,
  },

  plugins: [
    new CleanPlugin(outputPath, { root }),
    new webpack.DllPlugin({
      name: "lib",
      path: path.join(root, "build", "lib.manifest.json"),
    }),
  ],
});
