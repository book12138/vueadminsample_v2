module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 27123,
    https: false
    // proxytable: {
    //   '/api': {
    //     target: 'https://localhost:27644',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/'
    //     }
    //   }
    // }
  }
}
