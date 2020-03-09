const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  output: {
    filename: '[name].[hash:8].js',
    // chunkFilename: '[name]-vendors-[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, 'dist')
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|git|jpg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 3000,
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    //插进的引用, 压缩，分离美化
    new HtmlWebpackPlugin({
      //将模板的头部和尾部添加css和js模板,dist 目录发布到服务器上，项目包。可以直接上线
      file: 'index.html', //打造单页面运用 最后运行的不是这个
      template: 'src/index.html' //vue-cli放在跟目录下
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].css'
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.scss', '.css'], //用到文件的扩展名
    alias: {
      //模快别名列表
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer: {
    port: 3000,
    contentBase: './dist',
    open: true,
    progress: true,
    compress: true,
    proxy: {
      //可以配置跨域
    }
  }
}
