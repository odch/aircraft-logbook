const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const projects = require('./projects')

const projectName = process.env.npm_config_project || 'dev'
const conf = projects.load(projectName)

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.DefinePlugin({
      __CONF__: projects.packinize(conf)
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
}
