<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import topswiper from '@/components/topSwiper/topswiper'
export default {
  components: {
    topswiper
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.header
  border-bottom:1px solid #e8e8e8
  a
    float:left
    width:33.333%
    height:0.78rem
    border-bottom:0.08rem solid #fff
    text-align:center
    line-height:0.78rem
    font-size:0.29rem
    color:#202020
    &.router-link-active
      border-bottom:0.08rem solid #24a7f1
      color:#24a7f1
</style>
