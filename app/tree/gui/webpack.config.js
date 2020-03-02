var configBase = require("../../../lib/ts/base/webpack.config.base");
var configDevServer = require("../../../lib/ts/base/webpack.config.devServer");
var path = require('path');
var merge = require("webpack-merge");
var webpack = require('webpack');

// variables
var distPath = path.join(__dirname, 'dist');
var srcPath = path.join(__dirname, 'src');

// plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (env, argv) {
  return merge(configBase(env, argv), configDevServer(distPath), {
    context: srcPath,
    entry: {
      "geo-gui": './ts/twxplore/gui/geo/main.tsx'
    },
    output: {
      path: distPath,
      filename: 'js/[name].js',
      publicPath: ''
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: 'img',
        to: path.join(distPath, 'img/')
      }, 'graphiql.html', 'robots.txt']),
      new MiniCssExtractPlugin({
        disable: argv.mode !== "production",
        filename: 'css/[name].css'
      }),
      new HtmlWebpackPlugin({
        hash: true,
        template: 'index.html'
      })
    ],
    resolve: {
      alias: {
        // https://github.com/facebook/react/issues/13991
        react: path.resolve("..", "..", "..", "node_modules", "react")
      }
    }
  });
}