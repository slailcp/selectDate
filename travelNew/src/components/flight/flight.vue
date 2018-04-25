<template>
  <div class="flight">
    <div class="to-arrive-city">
      <div class="to-city" @click="toCity">
        <div class="citytitle">出发城市</div>
        <div class="cityname">{{modalData.citytoName}}</div>
      </div>
      <div class="change-wrapper">
        <div class="icon-change"><img src="./roundtrip_icon.png"/></div>
      </div>
      <div class="arrive-city" @click="arrive">
        <div class="citytitle">到达城市</div>
        <div class="cityname">{{modalData.cityarriveName}}</div>
      </div>
      <selectcity v-show="modalData.isShow" :modalData="modalData"></selectcity>
    </div>
    <div class="to-date">
      <div class="left-wrapper" @click="selectDate">
        <div class="title">出发时间</div>
        <div class="name">{{modalData.dateText}}</div>
      </div>
      <div class="icon-wrapper">
        <i class="icon-arrow-right"></i>
      </div>
    </div>
    <div class="type">
      <div class="left-wrapper">
        <div class="title">出差类型</div>
        <div class="name">商务出行</div>
      </div>
      <i class="icon-wrapper">
        <i class="icon-arrow-right"></i>
      </i>
    </div>
    <router-link to="/flightList" class="search-btn">立即搜索</router-link>
    <div class="lately－talk">
      <span class="talk-title">-最近乘坐-</span>
      <span class="talk-train">北京－杭州</span>
      <span class="talk-train">北京－杭州</span>
      <span class="talk-train">北京－杭州</span>
      <span class="talk-train">北京－杭州</span>
    </div>
    <transition name="dateHide">
      <div class="flight-selectdate" v-show="modalData.dateIsShow">
        <selectdate :modal="modalData" @selectDate="selectDateEvent"></selectdate>
      </div>
    </transition>
  </div>
</template>

<script>
import selectcity from '@/components/selectCity/selectcity'
import selectdate from '@/components/SelectDate/selectdate' // 所有日期全部展示出来
// import selectdate from '@/components/SelectDate/selectdatearow' // 点击一次展示一个月
export default {
  data () {
    return {
      modalData: { // 日期上面数据，例如价格，是否打折等等...
        index: 0,
        isShow: false,
        citytoName: '北京',
        cityarriveName: '杭州',
        dateIsShow: false,
        dateText: '6月8日',
        startDate: '2017-8-10',
        endDate: '2018-1-15',
        dateJson: [{
         date: '2017-8-11',
         price: '100'
        },
        {
         date: '2017-8-13',
         price: '100',
         rest: '休'
        },
        {
         date: '2017-8-15',
         price: '100',
         discount: '折'
        },
        {
         date: '2017-8-16',
         price: '100',
         rest: '假'
        }]
      }
    }
  },
  components: {
    selectcity,
    selectdate
  },
  methods: {
    selectDate() {
      this.modalData.dateIsShow = !this.modalData.dateIsShow;
    },
    selectDateEvent(data) {
      console.log(data)
      this.modalData.dateIsShow = !this.modalData.dateIsShow;
      let date = data.month + '月' + data.day + '日'
      this.modalData.dateText = date;
    },
    toCity(event) {
      this.modalData.isShow=true;
      this.modalData.index=0;
      this.$root.bindEvent.$emit('cityClick', event.target);
    },
    arrive() {
      this.modalData.isShow=true;
      this.modalData.index=1;
      // this.$root.bindEvent.$emit('cityClick', event.target);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.flight
  .to-arrive-city
    display:flex
    width:100%
    padding:.15rem 0
    border-bottom:1px solid #e8e8e8
    font-size:0.12rem
    .to-city,.arrive-city
      flex:1
      padding:0 .2rem
      font-size:.16rem
      .citytitle
        padding:.12rem 0
        color:#999
      .cityname
        font-size:0.3rem
        color:#666
    .arrive-city
      text-align:right
    .change-wrapper
      flex:0 0 0.65rem
      width: 0.65rem
      font-size:0
      .icon-change
        display:flex
        align-items:center
        width: 0.65rem
        height: 0.65rem
        border: 1px solid #292929
        border-radius: 50%
        justify-content:center
        img
          flex:0 0 0.4rem
          width:0.4rem
  .to-date,.type
    display:flex
    align-items:center
    padding:.12rem 0.2rem
    border-bottom:1px solid #e8e8e8
    font-size:.16rem
    .left-wrapper
      flex:1
      align-items:center
      .title
        padding:.12rem 0
        color:#999
      .name
        font-size:0.3rem
        color:#666
    .icon-wrapper
      flex:0 0 0.24rem
      width:.24rem
      height:.24rem
      .icon-arrow-right
        display:block
        width:.24rem
        height:.24rem
        background:url('./black_arrowright_icon.png') no-repeat;
        background-size:.24rem .24rem
  .search-btn
    display:block
    margin:.2rem
    padding:.25rem 0
    background:#ff6600
    border-radius:.1rem
    color:#fff
    text-align:center
    font-size:.36rem
  .lately－talk
    text-align:center
    font-size:.28rem
    .talk-title,.talk-train
      display:block
      padding:.12rem 0
      color:#999
    .talk-train
      color:#666
  .flight-selectdate
    position:fixed
    top:0
    bottom:0
    left:0
    width:100%
    overflow:auto
    z-index:999
    background:#fafafa
    transition:all .4s
    &.dateHide-enter-active,&.dateHide-leave
      opacity:1
      transform:translate3d(0,0,0)
    &.dateHide-leave-active,&.dateHide-enter
      opacity:0
      transform:translate3d(-720px,0,0)
</style>
