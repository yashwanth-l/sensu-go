import path from "path";

import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import base from "./base.webpack.config";

import vendorLibs from "./vendor.json";

export const outputPath = path.join(__dirname, "build", "lib");
export const entryPath = path.join(__dirname, "lib");

const lib = base({
  context: __dirname,

  entry: {
    lib: [entryPath].concat(vendorLibs),
  },

  output: {
    path: outputPath,
  },

  plugins: [
    new CleanPlugin(outputPath, { root: __dirname }),
    new webpack.DLLPlugin({
      name: "lib",
      // Emit the dll manifest in the go module root.
      outputPath: path.join(__dirname, "lib.manifest.json"),
    }),
  ],
});

export default lib;
