<template>
  <article class="card card-login card-dark">
    <div class="card-header">
      <span>
        <h3>登录</h3>
      </span>
    </div>
    <div class="card-body">
      <!-- 登录表单 -->
      <el-form
        style="margin-top:30px"
        :model="user"
        status-icon
        :rules="rules"
        ref="user"
        class="demo-ruleForm"
      >
        <!-- 用户名框组 -->
        <el-form-item class="font-dark" label="电话" prop="userPhone">
          <el-input prefix-icon="el-icon-user" v-model="user.userPhone" autocomplete="off" maxlength="11"></el-input>
        </el-form-item>
        <!-- 密码框组 -->
        <el-form-item class="font-dark" label="密码" prop="userPass">
          <el-input
            prefix-icon="el-icon-edit"
            type="password"
            v-model="user.userPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 按钮组 -->
        <el-form-item style="margin-top:60px">
          <el-button class="full-size btn-pink" @click="submitForm('user')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="card-footer card-footer-flex-center">
      <span class="font-dark">还没有账号?</span>
      <a href="javascript:void(0)" @click="goRegister" class="btn-link-pink">注册</a>
    </div>
  </article>
</template>

<script>
export default {
  name: "login",
  data() {
    let validatePhone = (rule, value, callback) => {
      //电话正则表达式
      let str = /^1(3|4|5|7|8|9)\d{9}$/;
      if (value === "") {
        callback(new Error("请输入电话"));
      } else if (!str.test(value)) {
        callback(new Error("电话号码格式错误"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      user: {
        userPhone: "",
        userPass: ""
      },
      rules: {
        userPass: [{ validator: validatePass, trigger: "blur" }],
        userPhone: [{ validator: validatePhone, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 如果验证成功则发起登陆请求
        if (valid) {
          // 将用户信息映射到FormData对象中
          let userForm = new FormData();
          // 分别映射用户名和密码
          userForm.append("userPhone", this.user.userPhone);
          userForm.append("userPass", this.user.userPass);
          // 使用axios发起ajax请求
          this.$axios
            // 参数为用户信息映射
            .post(this.HOME + "/login", userForm)
            .then(
              function(response) {
                // 清空输入框
                this.user.userPass = "";
                this.user.userPhone = "";
                // 获的响应数据部分
                let data = response.data;
                // 判断是否包含错误信息
                if('error' in data){
                  this.$message.error(data.error);
                }else{
                  this.$message({
                    message:"登录成功",
                    type:"success"
                  });
                  // 跳转主界面
                  this.$router.push('main');
                }
              }.bind(this)
            )
            .catch(err => {
              console.error(err);
            });
        } else {
          this.$message.error("请输入用户信息");
          return false;
        }
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      // 传值给同级组件
    },
    goRegister() {
      this.$emit("on-toRegister", true);
    }
  },
  watch: {}
};
</script>

<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");

/* 用于手机屏幕 */
@media screen and (max-width: 768px) {
  .card-login {
    position: relative;
    width: 100%;
    animation: fade-in-left;
    animation-duration: 1s;
    animation-fill-mode: both;
  }
}
/*  用于小平板 */
@media screen and (max-width: 992px) and (min-width: 768px) {
}

/* 用于中大尺寸平板 */
@media screen and (min-width: 992px) and (max-width: 1300px) {
}
</style>