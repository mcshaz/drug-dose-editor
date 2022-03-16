const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('htmlloader')
      .test(/\.static\.html$/)
      .use('html-loader')
      .loader('html-loader')
  }
})
