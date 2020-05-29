<template>
  <div class="kx">
    <!-- 价格图表 -->
    <div class="changeChart flex">
      <div>{{$t('dash.priceChart')}}</div>
      <div>
        <i
          v-for="(item, index) of pic_choose"
          :key="index"
          :class="['iconfont', item, current_pic==index?'isChoosed' : '']"
          @click="choosePic(index)"
        ></i>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content" v-show="show">
      <!-- 根据时间切换 -->
      <ul class="flex">
        <li
          v-for="(item, index) of time_choose"
          :key="item.id"
          :class="[active==index?'active':'']"
          @click="chooseTime(index)"
        >{{item.time}}</li>
      </ul>
      <!-- more -->
      <div class="more" v-if="more_show">
        <span v-for="item of more" :key="item.id" @click="chooseMore(item.time)">{{item.time}}</span>
      </div>
      <!-- 图表区 -->
      <div class="chart">
        <div id="tv_chart_container"></div>
      </div>
    </div>
    <div v-show="!show">
      <div id="echart" ref="myechart" style="height: 400px;width: 10rem;"></div>
    </div>
  </div>
</template>

<script>
import TVjsApi from "./tradingview/index";
let jsApi = null;
export default {
  data() {
    return {
      time_choose: [
        { time: "Line", id: 0 },
        { time: "1min", id: 1 },
        { time: "5min", id: 2 },
        { time: "15min", id: 3 },
        { time: "30min", id: 4 },
        { time: "60min", id: 5 },
        { time: "more", id: 6 }
      ],
      active: 1,
      current_pic: 0,
      pic_choose: ["icontubiaozoushitu", "icontubiaozhuxingtu"],
      // 图表内容的切换
      show: true,
      jsApi: null,
      more: [
        { time: "240min", id: 0 },
        { time: "1D", id: 1 },
        { time: "5D", id: 2 },
        { time: "1W", id: 3 },
        { time: "1M", id: 4 }
      ],
      more_show: false
    };
  },
  mounted() {
    jsApi = new TVjsApi("GXC-USDT");
    jsApi.init(); //图表初始化
    this.jsApi = jsApi;
    this.initEcharts();

    // 点击其他位置关闭下拉时间菜单
    let that = this;
    document.addEventListener("click", function(e) {
      if (e.target.className != "active") {
        that.more_show = false;
      }
    });
  },
  methods: {
    // 选择时间
    chooseTime(index) {
      this.active = index;

      if (index == 0) {
        this.jsApi.widgets.chart().setChartType(3);
        this.jsApi.widgets.chart().setResolution("1");
        this.jsApi.studies.forEach(item=>{
          item.then(id=>this.jsApi.widgets.activeChart().getStudyById(id).setVisible(false))
        })
      } else {
        this.jsApi.widgets.chart().setChartType(1);
        this.jsApi.studies.forEach(item=>{
          item.then(id=>this.jsApi.widgets.activeChart().getStudyById(id).setVisible(true))
        })
        switch (index) {
          case 1:
            this.jsApi.widgets.chart().setResolution("1");
            break;
          case 2:
            this.jsApi.widgets.chart().setResolution("5");
            break;
          case 3:
            this.jsApi.widgets.chart().setResolution("15");
            break;
          case 4:
            this.jsApi.widgets.chart().setResolution("30");
            break;
          case 5:
            this.jsApi.widgets.chart().setResolution("60");
            break;
          case 6:
            this.more_show = !this.more_show;
            break;
        }
      }
    },
    // 选择更多时间
    chooseMore(time) {
      switch (time) {
        case "240min":
          this.time_choose[6].time = time;
          this.jsApi.widgets.chart().setResolution("240");
          break;
        case "1D":
          this.time_choose[6].time = time;
          this.jsApi.widgets.chart().setResolution("1D");
          break;
        case "5D":
          this.time_choose[6].time = time;
          this.jsApi.widgets.chart().setResolution("5D");
          break;
        case "1W":
          this.time_choose[6].time = time;
          this.jsApi.widgets.chart().setResolution("1W");
          break;
        case "1M":
          this.time_choose[6].time = time;
          this.jsApi.widgets.chart().setResolution("1M");
          break;
      }
      this.more_show = false;
    },
    // 选择图表
    choosePic(index) {
      this.current_pic = index;
      if (index == 0) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    // 初始化echarts
    initEcharts() {
      var echarts = require("echarts");
      var echartCloth = this.$refs.myechart;
      var myChart = echarts.init(echartCloth);
      var doubleLineOption = {
        tooltip: {
          trigger: "axis"
        },
        //标题样式
        title: {
          textStyle: {
            color: "white"
          },
          left: 0
        },
        //图形位置
        grid: {
          left: "0%",
          right: "6%",
          bottom: "4%",
          top: 50,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgb(105, 120, 145)",
                fontSize: "13"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#555"
              }
            },
            boundaryGap: false,
            data: ["", 0.5, 0.52, 0.54, 0.56, 0.58, 0.6]
          }
        ],
        yAxis: [
          {
            type: "value",
            width: 0.5,
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgb(105, 120, 145)"
              }
            },
            // y轴的颜色和宽度
            axisLine: {
              width: 0.5,
              lineStyle: {
                color: "rgb(41, 52, 72)"
              }
            },
            min: 10,
            splitNumber: 5
          }
        ],
        series: [
          {
            type: "line",
            //折线堆积区域样式
            smooth: true,
            //折线连接点样式
            itemStyle: {
              color: "rgb(19,184,135)"
            },
            symbol: "none",
            //折线堆积区域样式
            areaStyle: {
              color: "rgb(22,125,100)"
            },
            data: [120, 120, 120, 100, 0, 0, 0]
          },
          {
            type: "line",
            smooth: true,
            symbol: "none",
            //折线连接点样式
            itemStyle: {
              color: "rgb(235,77,92)"
            },
            //折线堆积区域样式
            areaStyle: {
              color: "rgb(173,63,77)"
            },
            data: ["", "", "", "", 18, 120, 120, 80]
          }
        ]
      };
      myChart.setOption(doubleLineOption);
    }
  },
  destroyed() {
    jsApi.destoryinstance().then(bool => {
      if (bool) {
        jsApi = null;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.kx {
  width: 100%;
  box-sizing: border-box;
  #tv_chart_container {
    height: 100%;
  }
  .flex {
    display: flex;
  }
  .changeChart {
    z-index: 1000;
    position: relative;
    padding: 25px 30px;
    box-sizing: border-box;
    background: rgb(38, 48, 67);
    div {
      font-size: 30px;
      &:nth-child(1) {
        flex: 4;
      }
      &:nth-child(2) {
        flex: 0.7;
        i {
          margin: 0 10px;
          color: rgb(105, 120, 145);
        }
      }
    }
    .isChoosed {
      color: rgb(36, 160, 245) !important;
    }
  }
  ul {
    position: relative;
    background: rgb(29, 38, 53);
    outline: none;
    z-index: 1000;
    padding: 20px 20px;
    box-sizing: border-box;
    li {
      color: rgb(76, 87, 105);
      padding: 10px 15px;
    }
    .active {
      color: #fff;
      border-bottom: 3px solid rgb(36, 160, 245);
    }
  }
  .chart {
    height: 11rem;
  }
  .content {
    width: 100%;
    position: relative;
    .more {
      width: 100%;
      background: rgb(38, 48, 67);
      position: absolute;
      display: flex;
      span {
        display: inline-flex;
        justify-content: center;
        padding: 20px;
        flex: 1;
      }
    }
  }
}
</style>