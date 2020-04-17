const MovieHttp = require('./Http-movie');
class Top extends MovieHttp {
  static getMovies(start,count) {
    return this.request({
      url: "/in_theaters",
      data: {
        start: start,
        count: count
      }
    })
  }
}
module.exports = Top