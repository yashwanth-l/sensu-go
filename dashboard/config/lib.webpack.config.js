import fs from "fs";
import path from "path";

import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

const root = fs.realpathSync(process.cwd());

export const outputPath = path.join(root, "build", "lib");
export const entryPath = path.join(root, "lib");
export const manifestPath = path.join(root, "build", "lib.manifest.json");

export const vendor = ["react", "react-dom", "react-router-dom"];

export const libDLLReference = () =>
  new webpack.DllReferencePlugin({
    manifest: manifestPath,
  });

export default makeConfig({
  entry: {
    lib: [entryPath].concat(vendor),
  },

  output: {
    path: outputPath,
  },

  plugins: [
    new CleanPlugin(outputPath, { root }),
    new webpack.DLLPlugin({
      name: "lib",
      outputPath: manifestPath,
    }),
  ],
});
