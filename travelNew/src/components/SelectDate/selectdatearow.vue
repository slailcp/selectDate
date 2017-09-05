<template>
    <div>
      <div class="select-date">
        <div class="date-wapper" v-for="item in pullDate">
          <div class="arow-title">
            <div class="arow-left" @click="(arowIsClick?leftArow():null)"> < </div>
            <div class="date-title">{{item.title}}</div>
            <div class="arow-right" @click="(arowIsClick?rightArow():null)"> > </div>
          </div>
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
      arowIsClick: true,
      startDate: this.modal.startDate,
      endDate: this.modal.endDate,
      dateJson: this.modal.dateJson,
      dateObj: {}

    }
  },
  computed: {
    pullDate() {
      let allDate = '';
      for (var keys in this.dateObj) {
        delete this.dateObj[keys];
      }

      let s = (this.modal.startDate.split('-')[0] + '-' + this.modal.startDate.split('-')[1]);
      let e = (this.modal.endDate.split('-')[0] + '-' + this.modal.endDate.split('-')[1]);

      if (s === e) { //如果是一个月
        allDate = this.getAll(this.modal.startDate, this.modal.endDate);
        this.arowIsClick = false;
      } else { //如果超过一个月
        allDate = this.getAll(this.startDate, this.getLastMonthDay(this.startDate.split('-')[0], this.startDate.split('-')[1]));
      }

      allDate.forEach((item, index) => {
        if (index > 0) {
          item.month === allDate[index-1].month? this.dateObjPushData(item, false): this.dateObjPushData(item, true);
        } else {
          this.dateObjPushData(item, true);
        }
      })
      return this.dateObj;
    }
  },
  methods: {
    rightArow() {
      this.arowPrevNext('right');
    },
    leftArow(arow) {
      this.arowPrevNext('left')
    },
    dayClickEvent(data) {
      this.modal.dateIsShow = !this.modal.dateIsShow;
      let date = data.month + '月' +data.day +'日'
      this.modal.dateText = date;
    },
    arowPrevNext(arow) {
      let sy = Number(this.startDate.split('-')[0]);
      let sm = Number(this.startDate.split('-')[1]);
      let sd = Number(this.startDate.split('-')[2]);

      let defaultStartDate = Date.parse(new Date(this.modal.startDate));
      let defaultSEndDate = Date.parse(new Date(this.modal.endDate));

      if (arow === 'left') {
        if (Date.parse(new Date(sy+'-'+sm+'-'+1)) > defaultStartDate) {
          if (sm <= 1) {
            sm= 12;
            sy--;
          } else {
            sm--
          }
        }
      } else {
        if (Date.parse(new Date(this.getLastMonthDay(sy, sm))) <= defaultSEndDate) {
          if (sm >= 12) {
            sm= 1;
            sy++;
          } else {
            sm++
          }
        }
      }

      let sD = '';
      arow === 'left'? sD = Date.parse(new Date(sy+'-'+sm+'-'+1)): sD = Date.parse(new Date(sy+'-'+sm+'-'+sd));
      let eD = Date.parse(new Date(this.getLastMonthDay(sy, sm)));

      this.startDate = sy + '-' + sm + '-' + 1;
      this.endDate = this.getLastMonthDay(sy, sm);

      if (sD < defaultStartDate) { // 小于传入的时间
        this.startDate = this.modal.startDate;
      }
     if (eD > defaultSEndDate) { // 大于传入的时间
        this.endDate = this.modal.endDate;
      }
    },
    dateObjPushData(item, isWeek) {
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
      if (isWeek) {
        let week = item.week;
        if (!this.dateObj[key]) {
          this.dateObj[key] = {};
          for (let i = 0; i < week; i++) { // 对本月一号之前的周几补全。
            !this.dateObj[key].date? this.dateObj[key].date=[]: this.dateObj[key].date.push({});
          }
          this.dateObj[key].title = yearMonth;
          !this.dateObj[key].date? this.dateObj[key].date=[item]: this.dateObj[key].date.push(item);
        }
      } else {
        if (!this.dateObj[key]) {
          this.dateObj[key] = {};
          !this.dateObj[key].date? this.dateObj[key].date=[]: this.dateObj[key].date.push(item);
        } else {
          !this.dateObj[key].date? this.dateObj[key].date=[]: this.dateObj[key].date.push(item);
        }
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
    getLastMonthDay(year, month) { // 获取当前月的最后一天
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
      let myEnd = this.getLastMonthDay(end.split('-')[0], end.split('-')[1]);
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
  color:#333
  .date-wapper
    .arow-title
      display:flex
      .arow-left,.arow-right
        flex:0 0 1rem
        text-align:center
        width:1rem
        line-height: 1rem
      .date-title
        flex:1
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
        li
          position:relative
          float: left
          width:56px
          height:56px
          text-align:center
          line-height: 58px
          font-size:18px
          &.pass,&.future
            color:#333
            opacity:0.5
          &.day
            color:#333
          i
            display:block
            position:absolute
            color:#fff
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
            &.discount
              background:#ff6600
            &.price
              bottom:0
              left:0
              width:100%
              font-size:12px
              line-height:0.3rem

</style>
