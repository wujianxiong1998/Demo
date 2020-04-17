const Detail = require('../../models/Detail');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailDatas: [],
    toggle: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    Detail.getDetail(options.id).then(res=>{
      this.setData({
        detailDatas: res.data
      })
    })

    
  },
  toggleWords() {
    this.setData({
      toggle: !this.data.toggle
    })
  },
  handleCasts(e) {
    var index = e.currentTarget.dataset.castsindex;
    var urls = [];
    this.data.detailDatas.casts.forEach(item=>{
        urls.push(item.avatars.large)
    })
    wx.previewImage({
      current:urls[index],
      urls
    })
  },
  handleAvatar(e) {
    var index = e.currentTarget.dataset.avatarindex;
    var urls = [];
    this.data.detailDatas.photos.forEach(item=>{
        urls.push(item.image)
    })
    wx.previewImage({
        current:urls[index],
        urls
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})