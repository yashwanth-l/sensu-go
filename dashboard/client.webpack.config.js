import path from "path";

import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import base from "./base.webpack.config";

import libManifest from "./lib.manifest.json";

export const outputPath = path.join(__dirname, "build", "lib");
export const entryPath = path.join(__dirname, "src");

const lib = base({
  context: __dirname,

  entry: {
    lib: [path.join(__dirname, "lib")],
  },

  output: {
    path: outputPath,
  },

  plugins: [
    new CleanPlugin(outputPath, { root: __dirname }),
    new webpack.DllReferencePlugin({
      manifest: libManifest,
    }),
  ],
});

export default lib;
