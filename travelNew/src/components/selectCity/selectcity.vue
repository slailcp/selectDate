<template>
  <transition name="show">
    <div class="select-city-wrapper">
      <div class="layer-title">
        <div class="wrapper" @click="modalData.isShow=false"><span class="cancel">取消</span></div>
        <div class="title">城市选择</div>
        <div class="wrapper"></div>
      </div>
      <div class="search-wrapper">
        <input type="text" class="search-input" placeholder="中文/拼音/首字母">
      </div>
      <div class="fixed-list"></div>
      <div class="city-list">
        <div class="current-list">
          <div class="title">定位到当前城市</div>
          <div class="tag-list">
            <span class="tag">杭州</span>
          </div>
        </div>
        <div class="lately-list">
          <div class="title">最近访问的城市</div>
          <div class="tag-list clearFix">
            <span class="tag" v-for="(item,index) in latelyCity" @click="getCityName($event)">{{item}}</span>
          </div>
        </div>
        <div class="hot-list clearFix">
          <div class="title">热门城市</div>
          <div class="tag-list clearFix">
            <span class="tag" v-for="(item,index) in hotCity" @click="getCityName($event)">{{item}}</span>
          </div>
        </div>
        <div class="all-list">
          <div class="title">热门城市</div>
          <div class="letter-wrapper">
            <div class="letter">A</div>
            <ul class="letter-list">
              <li class="cityname"v-for="(item,index) in allCity" @click="getCityName($event)">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    modalData: {
      type: Object
    }
  },
  created() {
    this.latelyCity = ['北京', '上海', '广州', '杭州', '长沙', '乌鲁木齐', '天津', '四川'];
    this.hotCity = ['北京', '上海', '广州', '杭州', '长沙', '乌鲁木齐', '天津', '四川'];
    this.allCity = ['北京', '上海', '广州', '杭州', '长沙', '乌鲁木齐', '天津', '四川'];

    /* this.$root.bindEvent.$on('cityClick', (target) => {
      this.getStrings(target);
    }) */
  },
  methods: {
    getCityName(event) {
      let index = this.modalData.index;
      let thisCityname = event.currentTarget.innerHTML;
      if (index === 0) {
        this.modalData.citytoName = thisCityname;
      }
      if (index === 1) {
        this.modalData.cityarriveName = thisCityname;
      }
      this.modalData.isShow = false;
    },
    getStrings(event) {
      console.log(event)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.select-city-wrapper
  position:fixed
  transition:all .2s
  top:0
  left:0
  bottom:0
  z-index:100
  width:100%
  background:#f0f0f0
  .layer-title
    display:flex
    overflow: hidden
    height: 0.9rem
    background: #00357f
    position: fixed
    top: 0
    width: 100%
    left: 0
    line-height: 0.9rem
    .title
      flex:1
      height: 100%
      text-align: center
      line-height: 0.9rem
      color: #fff
      font-size: 0.29rem
    .wrapper
      flex:0 0 2rem
      width:2rem
      padding:0 0.3rem
      font-size:.24rem
      text-align: left
      color: #fff
      .enter,.cancel
        display:block
        height:100%
      .enter
        text-align:right
  .search-wrapper
      position: fixed
      top:.9rem
      left:0
      margin: 0 auto
      width: 100%
      padding: 0.2rem
      background: #f0f0f0
      .search-input
        width: 100%
        height: 1rem
        background: #fff
        border: 1px solid #e8e8e8
        border-radius: 6px
        padding-left: 0.6rem
        font-size: 0.3rem
        color: #333
        box-shadow: 2px 1px 7px #ccc
  .city-list
    position:fixed
    top:2.3rem
    bottom:0
    left:0
    width:100%
    padding:0 .2rem
    overflow-y:auto
    .current-list
      display:flex
      align-items:center
      padding:.2rem .12rem
      border-bottom: 1px solid #e8e8e8
      .title
        flex:2
        font-size:.26rem
        color:#333
        font-weight:500
      .tag-list
        flex:1
        text-align:right
        .tag
          display:inline-block
          padding: .2rem .3rem
          background:#32b9ab
          border-radius:.05rem
          color:#fff
          font-size:.26rem
    .lately-list,.hot-list
      padding-top:.12rem
      .title
        padding:.2rem .12rem
        font-size:.26rem
        color:#333
        font-weight:500
      .tag-list
        .tag
          width:1.9rem
          float:left
          margin:.12rem .12rem 0 0
          padding: .2rem 0
          background:#fff
          border:1px solid #e8e8e8
          border-radius:.1rem
          color:#666
          text-align:center
          font-size:.26rem
    .all-list
      .title
        padding:.2rem .12rem
        font-size:.26rem
        color:#333
        font-weight:500
      .letter-wrapper
        padding-left:.24rem
        .letter
          width: 1rem
          height: 1rem
          background: #fff
          line-height: 1rem
          text-align: center
          font-size: .44rem
          color: #666
        .letter-list
          .cityname
            padding: 0.2rem 0
            border-bottom: 1px solid #e8e8e8
            color: #666
            font-size: 0.3rem
.show-enter,.show-leave-active
  opacity:1
  transform:translateX(0)
.show-enter-active
  transform:translateX(-720px)
  opacity:0
</style>
