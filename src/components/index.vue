<template>
  <div class="wrapper-container">
    <!-- 注册窗格 -->
    <register-window :registerDialogVisible="whetherShow" @on-closeRegister="processShowR"></register-window>
    <!-- 登录窗格 -->
    <login-window :v-show="!whetherShow" @on-toRegister="processShowL"></login-window>
  </div>
</template>

<script>
import registerModule from './Register';
import loginModule from './Login';
import mask from './Mask';

export default {
  name: "index",
  components: {
    "register-window": registerModule,
    "login-window": loginModule,
    'mask-layer': mask
  },
  data() {
    return {
      whetherShow: false
    };
  },created() {
    
  },methods: {
    // 关闭注册框时的回调函数
    processShowL(val){
      this.whetherShow = val;
      // 打开注册框的回调函数
    },processShowR(val){
      this.whetherShow = val;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('../../static/css/custom.css');
body {
  background-color: black;
}
</style>
