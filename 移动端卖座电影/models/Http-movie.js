const baseUrl = "https://douban.uieee.com/v2/movie";
class MovieHttp {
  static request({
    url,
    data
  }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + url,
        data: data,
        dataType: 'json',
        header: {
          "content-type": "application/jsonp"
        },
        method: 'get',
        responseType: 'text',
        success: (res) => {
          resolve(res)
        }
      })
    })
  }
}
  module.exports = MovieHttp