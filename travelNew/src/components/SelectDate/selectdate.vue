<template>
    <div>
      <div class="select-date">
        <div v-for="item in pullDate">
          <div class="date-title">{{item.title}}</div>
          <ul>
            <li v-for="day in item.date" :class="day.classname" @click="(day.classname==='day'? dayClickEvent(day): null)">
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
export default {
  props: {
    modal: {
      type: Object
    }
  },
  data() {
    return {
      startDate: this.modal.startDate,
      endDate: this.modal.endDate,
      dateJson: this.modal.dateJson
    }
  },
  computed: {
      pullDate() {
        var dateObj = {};
        let allDate = this.getAll(this.startDate, this.endDate);
        allDate.forEach((item, index) => {
          if (index > 0) { // 当月一号以后
            // 前一天和后一天的月份是否相当？那么就是同一个月的：那么就是下个月的(如果超过当前的月份就是下个月一号)
            item.month === allDate[index - 1].month ? this.dateObjPushData(item, dateObj, false) : this.dateObjPushData(item, dateObj, true);
          } else { // 当月一号
            this.dateObjPushData(item, dateObj, true);
          }
        })
        return dateObj;
      }
  },
  methods: {
    dayClickEvent(data) {
      this.modal.dateIsShow = !this.modal.dateIsShow;
      let date = data.month + '月' +data.day +'日'
      this.modal.dateText = date;
    },
    dateObjPushData(item, dateObj, isWeek) {
      let yearMonth = item.year + '年' + item.month+ '月';
      let yearMonthDay = item.year + '-' + item.month + '-' + item.day;
      let className = '';
      let key = Date.parse(new Date(item.year + '-' + item.month + '-' + 1));
      let tag = this.pushTag(yearMonthDay);
      switch (this.compareDate(this.startDate, this.endDate, yearMonthDay)) {
        case 'day':
          className = 'day';
          break;
        case 'future':
          className = 'future';
          break;
        case 'pass':
          className = 'pass';
          break;
      };
      item.classname = className;
      item.tags = tag;
       if (isWeek) { // 每个月的一号
          console.log(item)
          let week = item.week; // 周几
          if (!dateObj[key]) { // 如果没有存储当前月的标识 (以月份为单位进行存储)
            dateObj[key] = {}; // 就创建一个对象标识
            for (let i = 0; i < week; i++) { // 对本月一号之前的周几补全。
              !dateObj[key].date ? dateObj[key].date = [] : dateObj[key].date.push({}); // 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
            }
            dateObj[key].title = yearMonth;
            !dateObj[key].date ? dateObj[key].date = [item] : dateObj[key].date.push(item); // 如果当前月份没有存储当前天数用的数组,就创建一个空数组,并且初始化存放item,如果有数组，就向里面依次填充
          }
        } else {
//          if (!dateObj[key]) { //
//            console.log(dateObj[key]);
//            dateObj[key] = {};
//            !dateObj[key].date ? dateObj[key].date = [] : dateObj[key].date.push(item);
//          } else {
//            !dateObj[key].date ? dateObj[key].date = [] : dateObj[key].date.push(item);
//          }
          dateObj[key].date.push(item)
        }
    },
    pushTag(yearMonthDay) { // 添加 价格信息，是否休息等。。。
      let tags = [];
      for (let i = 0; i < this.dateJson.length; i++) {
        if (yearMonthDay === this.dateJson[i].date) {
          for (let key in this.dateJson[i]) {
            tags.push([key, this.dateJson[i][key]]);
          }
          break;
        }
      }
      return tags;
    },
    compareDate(date1, date2, now) { // 当前日期是否在日期区间
      let d1 = new Date(date1);
      let d2 = new Date(date2);
      let n = new Date(now);
      if (date1 !== '' && now !== '' && d1 > n) {
        return 'pass';
      }
      if (date2 !== ''&& now !== '' && n > d2) {
        return 'future';
      }
      return 'day';
    },
    getFirstAndLastMonthDay(year, month) { // 获取当前月的最后一天
       let day = new Date(year, month, 0);
       let lastdate = year + '-' + month + '-' + day.getDate(); // 获取当月最后一天日期
       return lastdate;
    },
    DateFormat(obj) {
          let mouth = (obj.getMonth() + 1)>=10?(obj.getMonth() + 1):((obj.getMonth() + 1));
          let day = obj.getDate()>=10?obj.getDate():(obj.getDate());
          let week = new Date(obj.getFullYear() + '/' + mouth + '/' + day).getDay()
          return ({year: obj.getFullYear(), month: mouth, day: day, week: week}); // 返回日期。
    },
    getAll(begin, end) { // 获取两个日期间的所有日期
      let myBegin = begin.split('-')[0] + '-' + begin.split('-')[1] + '-' + 1;
      let myEnd = this.getFirstAndLastMonthDay(end.split('-')[0], end.split('-')[1]);
      let dateArr = [];
      let ab = myBegin.split('-');
      let ae = myEnd.split('-');
      let db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
      let de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      let unixDb = db.getTime();
      let unixDe = de.getTime();
      for (let k = unixDb; k <= unixDe;) {
          dateArr.push(this.DateFormat(new Date(parseInt(k))));
          k = k + 24 * 60 * 60 * 1000;
      }
      return dateArr;
    }
  },
  created() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.select-date
  background: #fafafa
  color:#fff
  .date-title
    width: 100%
    background-color: transparent
    color: #333
    line-height: 1rem
    font-weight: 400
    text-align: center
    letter-spacing: .025rem
    font-size:18px
    z-index: 9
  ul
    overflow: hidden
    border-bottom:1px solid #e8e8e8
    background: #fafafa
    li
      position:relative
      float: left
      width:52px
      height:56px
      margin-bottom:-1px
      border-bottom:1px solid #e8e8e8
      text-align:center
      line-height: 58px
      font-size:18px
      &.pass,&.future
        color:#ccc
        opacity:0.5
      &.day
        color:#333
      i
        display:block
        position:absolute
        color:#333
        font-style:normal
        font-size:12px
        &.date
          display:none
          font-style:none
        &.rest,&.discount
          right:0.1rem
          top:0.1rem
          width:0.3rem
          height:0.3rem
          background:#4AC29A
          line-height:0.3rem
          color:#fff
        &.discount
          background:#ff6600
          color:#fff
        &.price
          bottom:0
          left:0
          width:100%
          color:#333
          font-size:12px
          line-height:0.3rem

</style>
