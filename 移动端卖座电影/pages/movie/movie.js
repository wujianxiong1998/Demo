const  cityData  = require('../../assets/city.js');
Component({
  options: {
    styleIsolation: 'shared'
  },
  properties:{
    movieData: {
      type: Object,
      value: []
    },
    soonData: {
      type: Object,
      value: []
    }
  },

  data: {
    areaList: '',
    imgs: ['../../assets/images/03.jpg','../../assets/images/04.jpg','../../assets/images/07.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    pageActive: 0
  },

  methods:{

    onClose() {
      this.setData({ show: false });
    },
  
    onPageChange(event) {
      this.setData({pageActive: event.detail})
    }
  }
})