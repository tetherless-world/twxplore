var configBase = require("./webpack.config.base");
var path = require('path');
var merge = require("webpack-merge");
var DtsBundleWebpack = require('dts-bundle-webpack')
var webpack = require("webpack");

module.exports = function (env, argv) {
  return merge(configBase(env, argv), {
    context: path.join(__dirname, 'src'),
    entry: {
      "index": './twxplore/lib/base/index.ts'
    },
    // https://github.com/facebook/react/issues/13991
    externals: {
      react: "react",
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: "@tetherless-world/twxplore-base",
        libraryTarget: "umd",
        publicPath: ''
    },
    plugins: [
      new DtsBundleWebpack({
          main: path.join(__dirname, "out", "index.d.ts"),
          name: "@tetherless-world/twxplore-base",
          out: path.join(__dirname, "dist", "index.d.ts")
      }),
      new webpack.WatchIgnorePlugin([
        /\.js$/,
        /\.d\.ts$/
      ])
    ]
  });
}
