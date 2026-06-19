const path = require('path')
const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

function resolve (dir) {
  return path.join(__dirname, dir)
}

const page = {
  title: process.env.VUE_APP_TITLE || '邻里居', // 网页标题
  url: 'http://127.0.0.1:18400/api/p',
  // url: 'http://106.227.15.107:8400/',
  // url: 'https://s2.vivivi.club',
  port: process.env.port || process.env.npm_config_port || 80 // 端口
}

module.exports = {
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: page.port,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        },
        target: page.url,
        changeOrigin: true,
        ws: true,
        logLevel: 'debug'
      }
    },
    client: {
      overlay: false
    },
  },
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify')
      },
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ['path', 'name', 'aliasPath', 'meta']
          });
          return JSON.stringify(tfPages.routes)
        }, true)
      })
    ]
  }
}