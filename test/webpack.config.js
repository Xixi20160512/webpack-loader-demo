const { resolve } = require('path')

const pathResolve = (str) => resolve(__dirname, str)
const myLoader = pathResolve('../src/index.js')

module.exports = {
  entry: pathResolve('./index.js'),
  output: {
    path: pathResolve('./build'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /config\.js/,
        use: [
          'babel-loader',
          {
            options: {
              replaceMap: { '@': pathResolve('./') },
            },
            loader: myLoader,
          },
        ],
      },
    ],
  },
  //不要压缩混淆代码
  optimization: {
    minimize: false,
  },

  watch: true,
}
