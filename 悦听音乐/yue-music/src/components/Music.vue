<template>
  <div class="app">
    <el-container class="container">
      <el-header>
        <el-row>
          <el-col :span="2" class="font-size">悦听</el-col>
          <el-col :span="10" :offset="12">
            <el-input placeholder="请输入内容" v-model="keyword">
              <el-button slot="append" @click="searchSong" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-container>
          <el-main>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-table
                    ref="singleTable"
                    :data="hotSongsList"
                    highlight-current-row
                    style="width: 100%;"
                    :show-header="false"
                    max-height="430px"
                    border
                    @row-dblclick="playSong"
                  >
                    <el-table-column type="index" width="37"></el-table-column>
                    <el-table-column resizable>
                      <template slot-scope="scope">{{scope.row.name}} - {{scope.row.artist}}</template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-row class="zhen_pos">
                    <el-col>
                      <img :class="show?'center move':'center zhen'" src="../assets/zhen.png" />
                    </el-col>
                  </el-row>
                  <el-row class="cipan_pos">
                    <el-col>
                      <img src="../assets/cipan.png" class="cipan" />
                    </el-col>
                  </el-row>
                  <el-row class="play">
                    <el-col>
                      <i
                        @click="changeShow"
                        :class="show?'iconfont icon-zanting':'iconfont icon-bofang1'"
                      ></i>
                    </el-col>
                  </el-row>
                  <el-row class="cover">
                    <el-col>
                      <img :class="show?'rotate_play':'rotate_pause'" :src="songDetail.picUrl" />
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-table
                    ref="singleTable"
                    :data="commets"
                    highlight-current-row
                    style="width: 100%;"
                    :show-header="false"
                    max-height="430px"
                    border
                    @row-dblclick="playSong"
                  >
                    <el-table-column resizable>
                      <template slot-scope="scope">
                        <el-card>
                          <el-row>
                            <el-col>{{scope.row.content}}</el-col>
                          </el-row>
                        </el-card>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-main>
          <el-footer height="120">
            <aplayer
              @pause="handlePaused"
              @play="handlePlay"
              :audio="audio"
              :lrcType="1"
              ref="aplayerRef"
            />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <el-tag type="success" v-if="close" :style="[pos]" closable @close="handleClosed">活动眼睛</el-tag>
  </div>
</template>

<script>
export default {
  name: "Music",
  data() {
    return {
      keyword: "",
      hotSongsList: [],
      show: false,
      songDetail: {
        picUrl: require("../assets/bg.png"),
        songUrl: ""
      },
      audio: {
        name: "东西（Cover：林俊呈）",
        artist: "纳豆",
        url: "https://cdn.moefe.org/music/mp3/thing.mp3",
        cover: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300', // prettier-ignore
        lrc: ""
      },
      commets: [],
      timeInter: 0,
      screenWidth: document.body.clientWidth,
      screeHeight: document.body.clientHeight,
      pos: {
        position: "absolute",
        top: "0",
        left: "0",
        transition: '7s linear'
      },
      top: 0,
      left: 0,
      close: true
    };
  },
  created() {
    this.getSongList();
  },
  methods: {
    async getSongList() {
      const { data: res } = await this.$http("top/song?type=7");
      if (res.code !== 200) {
        return this.$message.error("获取失败！");
      }
      res.data.forEach(item => {
        this.hotSongsList.push({
          id: item.id,
          artist: item.artists[0].name,
          arId: item.artists[0].id,
          name: item.name.length > 8 ? item.name.slice(0, 8) + "..." : item.name
        });
      });
    },

    // 改变播放状态
    changeShow() {
      this.show = !this.show;
      if (this.show === false) {
        this.$refs.aplayerRef.pause();
        clearInterval(this.timeInter)
        this.timeInter = 0
        return;
      }
      this.$refs.aplayerRef.play();
      this.timeInterval();      
    },

    // 选择歌曲
    async playSong(row) {
      const { data: res } = await this.$http(`song/detail?ids=${row.id}`);
      if (res.code !== 200) {
        this.$message.error("获取歌曲详情失败！");
      }
      this.songDetail.picUrl = res.songs[0].al.picUrl;
      this.audio.cover = res.songs[0].ar.picUrl;
      this.audio.name = res.songs[0].name;
      this.audio.artist = res.songs[0].ar[0].name;

      const result = await this.$http(`song/url?id=${row.id}`);
      this.audio.url = result.data.data[0].url;

      const picResult = await this.$http(`artist/album?id=${row.arId}`);
      this.audio.cover = picResult.data.artist.picUrl;

      const wordResult = await this.$http(`lyric?id=${row.id}`);
      this.audio.lrc = wordResult.data.lrc.lyric;
      this.$refs.aplayerRef.play();

      const commetResult = await this.$http(`comment/hot?type=0&id=${row.id}`);
      this.commets = commetResult.data.hotComments;
    },

    // 搜索歌曲
    async searchSong() {
      this.hotSongsList = [];
      const { data: res } = await this.$http(`search?keywords=${this.keyword}`);
      if (res.code !== 200) {
        this.$message.error("未搜索到相关歌曲！");
      }
      res.result.songs.forEach(item => {
        this.hotSongsList.push({
          name: item.name,
          id: item.id,
          artist: item.artists[0].name,
          arId: item.artists[0].id
        });
      });
    },
    handlePaused() {
      this.show = false;
    },
    handlePlay() {
      this.show = true;
    },
    timeInterval() {
      this.timeInter = setInterval(() => {
        if (this.left < this.screenWidth - 110 && this.top==0) {
          this.left += 10;
          this.pos.left = this.left + "px";
          return;
        } else if (this.top < this.screeHeight - 60 && this.left>0) {
          this.top += 10;
          this.pos.top = this.top + "px";
          return;
        } else if (this.top >= this.screeHeight - 60 && this.left>0){
          this.left -= 10;
          this.pos.left = this.left + "px";
        } else  {
          this.top -= 10;
          this.pos.top = this.top + "px";
        }
      }, 100);
      console.log('action')
    },
    handleClosed() {
      this.close = false
    }
  }
};
</script>

<style scoped lang="less">
.rotate_pause {
  animation: rotated 8s linear infinite;
  animation-play-state: paused;
}
.rotate_play {
  animation-play-state: running;
  animation: rotated 8s linear infinite;
}
@keyframes rotated {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.cover {
  position: absolute;
  top: 160px;
  left: 430px;
  img {
    width: 160px;
    height: 160px;
    border-radius: 50%;
  }
}
.move {
  width: 370px;
  height: 280px;
  transform: rotate(0deg);
  transition: all 1s linear;
}
.center {
  transform-origin: 55% 15%;
}
.zhen {
  width: 370px;
  height: 280px;
  transform: rotate(-17deg);
  transition: all 1.3s linear;
}
.zhen_pos {
  position: absolute;
  z-index: 10;
  top: -73px;
  left: 391px;
}
.cipan {
  width: 510px;
  height: 400px;
}
.cipan_pos {
  position: absolute;
  top: 40px;
  overflow: hidden;
  height: 350px;
}
.el-table {
  font-size: 12px;
}
.font-size {
  font-size: 20px;
  color: #fff;
}
.text_left {
  text-align: left;
}
.play {
  position: absolute;
  z-index: 100;
  top: 162px;
  left: 494px;
  i {
    font-size: 30px;
    z-index: 1000;
    color: #ffc312;
  }
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  min-height: 630px;
  max-height: 630px;
  overflow: hidden;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.el-header {
  background-color: #9980fa;
  color: #333;
  text-align: center;
  line-height: 60px;
  opacity: 0.7;
}
.el-tag {
  margin: 5px;
}
.el-footer {
  background-color: #c8d6e5;
  padding: 0px;
  margin: 0px;
}
.el-main {
  background-color: #c8d6e5;
  color: #333;
  text-align: center;
  line-height: 160px;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-table {
  overflow-x: none !important;
  opacity: 0.7;
}
.app {
  height: 100%;
  background-image: radial-gradient(
    circle at top right,
    #97cee5 0px,
    rgb(230, 196, 233) 400px
  );
}
</style>
