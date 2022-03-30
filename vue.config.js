const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.VUE_APP_BASE_ROUTE || '/',
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('htmlloader')
      .test(/\.static\.html$/)
      .use('html-loader')
      .loader('html-loader')
  }
})
