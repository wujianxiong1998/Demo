const TopMovie = require('../../models/Top');
const SoonMovie = require('../../models/Soon');
Page({
  data: {
    active: 0,
    movieData: [],
    soonData: [],
    top_start: 0,
    soon_start: 0,
    top_msg: '',
    soon_msg: ''
  },
  onLoad() {

    TopMovie.getMovies(0, 20).then(res => {
      this.setData({
        movieData: res.data.subjects,
        top_total: res.data.total
      })
    });
    SoonMovie.getSoon(0, 20).then(res => {
      this.setData({
        soonData: res.data.subjects,
        soon_total: res.data.total
      })
    })
  },
  onBottomChange(event) {
    this.setData({
      active: event.detail
    })
  },
  onReachBottom() {

    var top_start = this.data.top_start;
    var soon_start = this.data.soon_start;
    var movieData = this.data.movieData;
    var soonData = this.data.soonData;
    var top_total = this.data.top_total;
    var soon_total = this.data.soon_total;
    if (this.data.active == 0) {
      top_start += 20;
      if (top_start >= top_total) {
        this.setData({
          top_msg: "没有更多数据！"
        })
      } else {
        TopMovie.getMovies(top_start, 20).then(res => {
          this.setData({
            movieData: movieData.concat(res.data.subjects)
          })
        })
      }
    }
    if (this.data.active == 1) {
      soon_start += 20;
      if (soon_start >= soon_total) {
        this.setData({
          soon_msg: "没有更多数据！"
        })
      } else {
        SoonMovie.getSoon(soon_start, 20).then(res => {
            this.setData({
              soonData: soonData.concat(res.data.subjects)
            })
        })
      }
    }
    this.setData({
      top_start: top_start,
      soon_start: soon_start
    })
  }
})