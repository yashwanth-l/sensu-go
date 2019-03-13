import fs from "fs";
import path from "path";

import CleanPlugin from "clean-webpack-plugin";

import makeConfig from "./base.webpack.config";

import { libDLLReference } from "./lib.webpack.config";

const root = fs.realpathSync(process.cwd());

export const outputPath = path.join(root, "build", "lib");
export const entryPath = path.join(root, "src");

export default makeConfig({
  entry: {
    lib: [path.join(root, "lib")],
  },

  output: {
    path: outputPath,
  },

  plugins: [new CleanPlugin(outputPath, { root }), libDLLReference()],
});
