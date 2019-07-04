<template>
  <div>
    <div class="select-date">
      <ul style='height: 80px;'>
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <div class="date-wapper" v-for="item in pullDate">
        <div class="arow-title">
          <div class="arow-left" @click="leftArow"> <</div>
          <div class="date-title">{{item.title}}</div>
          <div class="arow-right" @click="rightArow"> ></div>
        </div>
        <ul>
          <li v-for="day in item.date" :class="day.classname"
              @click="(day.classname==='day'? dayClickEvent(day): null)">
            {{day.day}}
            <i v-for="tag in day.tags" :class="tag[0]">
              {{tag[1]}}<span v-show="tag[0]==='price'">元</span>
            </i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      modal: {
        type: Object
      }
    },
    data() {
      return {
        startDate: this.modal.startDate, // 初始时间
        endDate: moment(this.modal.startDate).endOf('month').format('YYYY-MM-DD'),//this.modal.endDate, // 截止时间
        dateJson: this.modal.dateJson,
        currentDate: this.modal.currentDate,
        pullDate: null
      }
    },
    computed: {
      // pullDate() {
      //   const all = this.getAll(this.startDate, this.endDate);
      //   return all;
      // }
    },
    created() {
      this.pullDate = this.getAll(this.startDate, this.endDate);
    },
    methods: {
      init() {
        this.pullDate = this.getAll(this.startDate, this.endDate);
      },
      leftArow() {
        this.startDate = (moment(this.startDate).add(-1, 'month')).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.startDate).endOf('month').format('YYYY-MM-DD');
        const a = moment(this.startDate); // 切换的第一天
        const b = moment(this.modal.startDate); // 设置的开始时间

        if (moment(b).diff(a) >= 0) {
          this.startDate = this.modal.startDate;
          this.endDate = moment(this.startDate).endOf('month').format('YYYY-MM-DD');
        }

        this.pullDate = this.getAll(this.startDate, this.endDate);
      },
      rightArow() {
        this.startDate = (moment(this.startDate).add(1, 'month')).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.startDate).endOf('month').format('YYYY-MM-DD');// 最后一天;
        const a = moment(this.endDate); // 切换的最后一天
        const b = moment(this.modal.endDate); // 设置的截止时间
        if (moment(a).diff(b) >= 0) {
          this.endDate = this.modal.endDate
          this.startDate = moment(this.endDate).startOf('month').format('YYYY-MM-DD')
        }
        this.pullDate = this.getAll(this.startDate, this.endDate);

      },
      dayClickEvent(data) {
        this.$emit('selectDate', data);
      },
      pushTag(yearMonthDay) { // 添加 价格信息，是否休息等。。。
        let tags = [];
        for (let i = 0; i < this.dateJson.length; i++) {
          if (moment(yearMonthDay).format('x') === moment(this.dateJson[i].date).format('x')) {
            for (let key in this.dateJson[i]) {
              tags.push([key, this.dateJson[i][key]]);
            }
            break;
          }
        }
        return tags;
      },

      setClass(start, end, i) { //根据日期给div设置样式
        let className = '';
        if (i >= moment(start).format('x') && i <= moment(end)) { // 是否在开始和结束之间
          className = 'day';
          if (moment(i).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) { // 今天
            className += ' today';
          }
          this.currentDate.forEach(item => { // currentDate
            if (moment(i).format('YYYY-MM-DD') === moment(item).format('YYYY-MM-DD')) {
              className += ' curday';
            }
          })
        } else {
          className = 'pass';
          if (moment(i).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            className += ' today';
          }
        }
        return className;
      },
      getAll(start, end) { // 获取两个日期间的所有日期
        console.log(start)
        console.log(end)
        const sd = Number(moment(start).startOf('month').format('x')); // 本月第一天
        const ed = Number(moment(end).endOf('month').format('x')); // 本月最后一天

        let dataObject = {};

        dataObject[sd] = {title: moment(start).format('YYYY年MM月'), date: []} // 初始第一个月
        for (let w = 1; w < moment(sd).weekday(); w++) { // 对本月一号之前的周几补全。
          dataObject[sd].date.push({year: '', month: '', day: '', week: w});// 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
        }

        for (let i = sd; i <= ed;) {
          const firstDay = Number(moment(i).startOf('month').format('x')); // 当月第一天;--作为每个月的唯一标示

          if (moment(i).format('x') === moment(moment(i).startOf('month').format('YYYY-MM-DD')).format('x') && i !== sd) { // 如果是当月的第一天,添加下个月的数据
            console.log(i, sd)
            const op = {
              title: moment(i).add(1, 'days').format('YYYY年MM月'), // 下个月的第一天
              date: []
            }
            for (let w = 1; w < moment(i).weekday(); w++) { // 对本月一号之前的周几补全。
              op.date.push({year: '', month: '', day: '', week: w});// 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
            }
            dataObject[i] = op;
          }

          //根据日期给div设置样式
          let className = this.setClass(start, end, i);

          const tag = this.pushTag(moment(i).format('YYYY-MM-DD')); // 折扣，休息等信息

          const option = {
            year: moment(i).format('YYYY'),
            month: moment(i).format('MM'),
            day: moment(i).format('DD'),
            week: moment(i).weekday(),
            classname: className,
            tags: tag
          }
          dataObject[firstDay].date.push(option);
          i = Number(moment(i).add(1, 'days').format('x')); // 下次赋值
        }
        return dataObject;
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  ul
    overflow: hidden
    li
      position: relative
      float: left
      width: 56px
      height: 56px
      text-align: center
      line-height: 58px
      font-size: 18px
      &.pass, &.future
        color: #333
        opacity: 0.5
      &.day
        color: #333
      i
        display: block
        position: absolute
        color: #fff
        font-style: normal
        font-size: 12px
        &.date
          display: none
          font-style: none
        &.rest, &.discount
          right: 0.1rem
          top: 0.1rem
          width: 0.3rem
          height: 0.3rem
          background: #4AC29A
          line-height: 0.3rem
        &.discount
          background: #ff6600
        &.price
          bottom: 0
          left: 0
          width: 100%
          font-size: 12px
          line-height: 0.3rem


  .select-date
    background: #fafafa
    color: #333
    .date-wapper
      .arow-title
        display: flex
        .arow-left, .arow-right
          flex: 0 0 1rem
          text-align: center
          width: 1rem
          line-height: 1rem
        .date-title
          flex: 1
          background-color: transparent
          color: #333
          line-height: 1rem
          font-weight: 400
          text-align: center
          letter-spacing: .025rem
          font-size: 18px
          z-index: 9

</style>
