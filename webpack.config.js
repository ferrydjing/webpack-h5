const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const uglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const opimizeCss = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'js/[name].[hash:8].js',
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
            // outputPath: 'js/'
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
              publicPath: './'
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: path.resolve(__dirname, 'dist')
              outputPath: 'css'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: loader => [
                // 可以配置多个插件
                require('autoprefixer')({
                  overrideBrowserslist: [
                    '> 1%',
                    'last 2 versions',
                    'not ie <= 8'
                  ]
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|git|jpg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 1024,
              name: 'img/[name].[hash:8].[ext]',
              publicPath: '../'
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
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].css'
    }),
    require('autoprefixer')
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
    },
    minimizer: [
      new uglifyJsWebpackPlugin({
        cache: true, //是否缓存
        parallel: true, //是否并发打包，同时打包多个文件
        sourceMap: true, //打包后的代码与源码的映射，方便调试
        uglifyOptions: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          output: {
            // 删除所有的注释
            comments: false,
            // 最紧凑的输出
            beautify: false
          },
          compress: {
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true
          }
        }
      }),
      new opimizeCss()
    ]
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
