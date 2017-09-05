<template>
  <div class="toptitle-wrapper">
    <div class="back" @click="$router.go(-1)"> < </div>
    <div class="title">{{msg}}</div>
    <router-link to="/flight" class="home">首页</router-link>
  </div>
</template>

<script>
export default {
  props: ['msg']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.toptitle-wrapper
  display:flex
  position:fixed
  top:0
  z-index:100
  width:100%
  height:0.7rem
  background:rgba(7,17,27,.8)
  line-height:0.7rem
  text-align:center
  color:#fff
  font-size:0.26rem
  .back
    flex:1
  .home
    flex:1
    color:#fff
  .title
    flex:3
</style>
