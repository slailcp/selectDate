<template>
  <swiper :options="swiperOption"  ref="mySwiper">
      <swiper-slide v-for="(item,index) in topName">
        <img src="./flight-top-pic.jpg" width="100%">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
   components: {
       swiper,
       swiperSlide
   },
   created() {
    this.topName=['./flight-top-pic.jpg', './train-top-pic.jpg']
   },
   data() {
       return {
           swiperOption: {
           notNextTick: true,
           pagination: '.swiper-pagination',
           slidesPerView: 'auto',
           centeredSlides: true,
           paginationClickable: true,
           spaceBetween: 30,
               onSlideChangeEnd: swiper => {
                   //这个位置放swiper的回调方法
                   this.page = swiper.realIndex+1;
                   this.index = swiper.realIndex;
               }
           }
       }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
img
  max-height:100px
</style>
