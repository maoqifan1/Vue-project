<template>
  <div class="mask" v-show="show"></div>
</template>
<script>
export default {
  name: "maskLayer",
  props: {
    show: Boolean
  },
  data() {
    return {
      myShow: this.show == null || this.show == false ? false : true
    };
  },
  watch: {
      // 当父组件值改变时，更新子组件对应值
    show(val) {
      this.myShow = val;
    }
  }
};
</script>
<style scoped>
/* 遮罩，用于遮挡当前页面元素 */
.mask {
  position: absolute;
  opacity: 0.8;
  background-color: #22252a;
  z-index: 2;
  width: 100%;
  height: 100%;
}
</style>