const Http = require('./Http-movie');
class Soon extends Http{
  static getSoon(start,count){
    return this.request({
      url: '/coming_soon',
      data: {
        start: start,
        count: count
      }
    })
  }
}
module.exports = Soon