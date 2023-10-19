/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-preprocessor-directives/webpack')(),
    ],
  },
  chainWebpack: (config) => {
    config.module
      .rule('html')
      .test(/\.html$/)
      .use('html-webpack-plugin/loader')
      .loader(require.resolve('html-webpack-plugin/lib/loader.js'))
      .options({
        force: true,
      })
      .end()
  },
}
