<template>
  <div>
    <div class="select-date">
      <ul>
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>

      </ul>
      <div v-for="item in pullDate">
        <div class="date-title">{{item.title}}</div>
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
  import moment from 'moment';

  export default {
    props: ['modal'],
    data() {
      return {
        startDate: this.modal.startDate,
        endDate: this.modal.endDate,
        dateJson: this.modal.dateJson,
        currentDate: this.modal.currentDate
      }
    },
    computed: {
      pullDate() {
        const all = this.getAll(this.startDate, this.endDate);
        console.log(all)
        return all;
      }
    },
    created() {
      // console.log(this.getAll('2017-08-05','2018-08-09'))
    },
    methods: {
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
      getAll(start, end) { // 获取两个日期间的所有日期数据
        console.log(start)
        console.log(end)
        const sd = Number(moment(start).startOf('month').format('x')); // 本月第一天
        const ed = Number(moment(end).endOf('month').format('x')); // 本月最后一天

        let dataObject = {};

        dataObject[sd] = {title: moment(start).format('YYYY年MM月'), date: []} // 初始第一个月
        for (let w = 0; w < moment(sd).weekday(); w++) { // 对本月一号之前的周几补全。
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
            for (let w = 0; w < moment(i).weekday(); w++) { // 对本月一号之前的周几补全。
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
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .select-date
    background: #fafafa
    color: #333
    .date-title
      width: 100%
      background-color: transparent
      color: #333
      line-height: 1rem
      font-weight: 400
      text-align: center
      letter-spacing: .025rem
      font-size: 18px
      z-index: 9
    ul
      overflow: hidden
      border-bottom: 1px solid #e8e8e8
      background: #fafafa
      li
        position: relative
        float: left
        width: 52px
        height: 56px
        margin-bottom: -1px
        border-bottom: 1px solid #e8e8e8
        text-align: center
        line-height: 58px
        font-size: 18px
        &.pass, &.future
          color: #ccc
          opacity: 0.5
        &.day
          color: #333
        i
          display: block
          position: absolute
          color: #333
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
            color: #fff
          &.discount
            background: #ff6600
            color: #fff
          &.price
            bottom: 0
            left: 0
            width: 100%
            color: #333
            font-size: 12px
            line-height: 0.3rem

</style>
