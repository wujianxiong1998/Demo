module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main.js')
      config.set('externals', {
        vue: 'Vue',
        axios: 'axios',
        nprogress: 'NProgress',
        aplayer: '@moefe/vue-aplayer'
      })
    })
  }
}