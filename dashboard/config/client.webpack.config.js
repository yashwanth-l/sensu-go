import fs from "fs";
import path from "path";
import webpack from "webpack";

import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

const root = fs.realpathSync(process.cwd());
const outputPath = path.join(root, "build", "client");

export default makeConfig({
  entry: {
    src: [path.join(root, "src", "client")],
  },

  output: {
    path: outputPath,
  },

  plugins: [
    new CleanPlugin(outputPath, { root }),
    new webpack.DllReferencePlugin({
      manifest: path.join(root, "build", "lib.manifest.json"),
    }),
  ],
});
