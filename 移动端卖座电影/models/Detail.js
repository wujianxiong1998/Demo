const Http = require('./Http-movie');
class Detail extends Http {
  static getDetail(id) {
    return this.request({
      url: `/subject/${id}`
    })
  }
}
module.exports = Detail