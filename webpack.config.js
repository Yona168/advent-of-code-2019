const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
  mode: "development",
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [new TsconfigPathsPlugin({
      configFile: "./tsconfig.json"
    })]
  },

  context: path.resolve(__dirname, "src"),
  entry: "index.ts",
  target: "node",
  node: {
    __dirname: false,
    __filename: false
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  }

};
