'use strict'

const webpack = require("webpack")
const htmlWebpackPlugin = require("html-webpack-plugin")
const OpenBrowserPlugin = require('open-browser-webpack-express-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const path = require('path')
const autoprefixer = require('autoprefixer')
var rootPath = path.resolve(__dirname)

module.exports = {
  context: rootPath,
  entry: {
    app: './src/app.js',
  },
  output: {
    path: '/build',
    filename: "js/[name].js",
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: "babel-loader",
      exclude: path.resolve(__dirname, 'node_modules')
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
    }, {
      test: /\.html$/,
      loader: "html-loader"
    }, {
      test: /\.(png|jpg|gif|svg)$/i,
      loader: 'file-loader',
      options: { name: 'assets/[name]-[hash:5]-[ext]' }
    }]
  },
  resolve: {
    extensions: [
      '.js', '.jsx'
    ],
    alias: {
      COMPONENTS: path.resolve(__dirname, '../components')
    }
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    stats: 'errors-only',
    host: process.env.Host,
    port: process.env.PORT,
    overlay: {
      errors: true,
      warnings: true,
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
      miniify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function() {
          return [autoprefixer];
        }
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new DashboardPlugin(),
    new OpenBrowserPlugin()
  ]
}