<template>
  <nav class="page-bar Page navigation">
    <ul class="pagination pagination-dark justify-content-end">
      <!-- <li class="first">
        <span>共{{dataNum}}条记录 第 {{cur}} / {{all}} 页</span>
      </li>-->
      <li class="page-item" v-if="cur>1">
        <!-- 点击上一页 -->
        <a class="page-link page-link-dark" v-on:click="cur--,pageClick()" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <li class="page-item" v-if="cur===1">
        <!-- 点击第一页时显示 -->
        <a class="disabled page-link page-link-dark" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <li
        class="page-item"
        v-for="index in indexs"
        :key="index"
        :class="{ 'active': cur === index}"
      >
        <!-- 页码 -->
        <a class="page-link page-link-dark" v-on:click="btnClick(index)">{{ index }}</a>
      </li>
      <li class="page-item" v-if="cur!==all">
        <!-- 点击下一页 -->
        <a class="page-link page-link-dark" v-on:click="cur++,pageClick()" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </a>
      </li>
      <li class="page-item" v-if="cur===all">
        <!-- 点击最后一页时显示 -->
        <a class="disabled page-link page-link-dark" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </a>
      </li>
      <!-- 共有多少页
      <li class="page-item">
        <span>
          共
          <i>{{all}}</i>页
        </span>
      </li>-->
    </ul>
  </nav>
</template>

<script>
import $ from 'jquery';
import bootstrap4 from '../static/bootstrap4/js/bootstrap';

export default {
  name: "pagnation",
  //从父级组件中传值过来的需要跟父级传入的名字一致
  props: {
    // dataAll: Number,
    dataCur: Number, // 当前页码
    datanum: Number,  // 一页中显示的导航条数字的数量 必须为奇数
    dataDatanum: Number, // 数据总量
    dataPerPageNum: Number // 每页显示的数据的数量
  },

  data: function() {
    return {
      all: 0, // 总页面数，不需要父组件传值，由子组件计算完成
      cur: this.dataCur, //当前页码
      num: this.datanum, //一页显示的导航条数字数量  奇数
      perPageNum: this.dataPerPageNum, // 一页中显示的数据的条数
      dataNum: this.dataDatanum //数据的数量
    };
  },
  created() {
    this.calcPageNum();
    console.log(this.all+":"+this.$el);
  },
  watch: {
    cur: function(oldValue, newValue) {
      //父组件通过change方法来接受当前的页码
      this.$emit("change", oldValue);
      //这里是直接点击执行函数
    },
    // 监听父组件中传来的值
    dataDatanum(val) {
      this.dataNum = val;
      // 动态计算总页面数
      this.calcPageNum();
    }
  },
  methods: {
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        this.cur = data;
      }
    },
    pageClick: function() {
      console.log("现在在" + this.cur + "页");
      //父组件通过change方法来接受当前的页码
      //点击下一页所执行函数
      this.$emit("change", this.cur);
    },
    calcPageNum: function() {
      // 动态计算总页面
      this.all =
        this.perPageNum > this.dataNum
          ? 1
          : Math.ceil(this.dataNum / this.perPageNum);
    }
  },
  computed: {
    indexs: function() {
      var left = 1;
      var right = this.all;
      var ar = [];
      if (this.all >= this.num) {
        if (this.cur > 3 && this.cur < this.all - 2) {
          left = this.cur - (this.num - 1) / 2;
          right = this.cur + (this.num - 1) / 2;
        } else {
          if (this.cur <= 3) {
            left = 1;
            right = this.num;
          } else {
            right = this.all;
            left = this.all - (this.num - 1);
          }
        }
      }
      while (left <= right) {
        ar.push(left);
        left++;
      }
      return ar;
    }
  }
};
</script>

<style scoped>
@import url("../static/bootstrap4/css/bootstrap.css");
.pagination {
  margin-bottom: 0;
}
/*  黑色风格的分页按钮  */
.page-link-dark {
  background: #2d3035 !important;
  border: 1px solid #22252a !important;
  transition: all 0.7s ease 0s;
  -webkit-transition: all 0.7s ease 0s;
  -moz-transition: all 0.7s ease 0s;
}

.page-link-dark:hover {
  background: #22252a !important;
  color: #c27878 !important;
}

.page-link-dark.disabled {
  cursor: no-drop;
}

.page-item.active .page-link-dark {
  color: #c27878 !important;
}
</style>
