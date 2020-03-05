<template>
  <div>
    <el-dialog title="注册" @close="handleClose" :visible.sync="myRegisterDialogVisible">
      <!-- 登录表单 -->
      <el-form :model="user" status-icon :rules="rules" ref="user" class="demo-ruleForm">
        <!-- 用户头项上传框 -->
        <el-form-item class="font-dark" label="用户头像" prop="usericon">
          <el-input
            v-model="user.usericon"
            auto-complete="off"
            placeholder="点击图标上传头像"
            :disabled="true"
          >
            <i
              style="cursor:pointer !important"
              slot="prefix"
              class="el-input__icon el-icon-picture"
              @click="openImgDialog"
            ></i>
          </el-input>
        </el-form-item>
        <!-- 用户电话框组 -->
        <el-form-item class="font-dark" label="电话" prop="userPhone">
          <el-input
            prefix-icon="el-icon-phone"
            maxlength="11"
            v-model="user.userPhone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 用户名框组 -->
        <!-- <el-form-item class="font-dark" label="用户名" prop="username">
          <el-input prefix-icon="el-icon-user" maxlength="10" v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>-->
        <!-- 密码框组 -->
        <el-form-item class="font-dark" label="密码" prop="userPass">
          <el-input
            prefix-icon="el-icon-edit"
            type="password"
            v-model="user.userPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-pink" @click="submitForm('user')">注册</el-button>
      </div>
    </el-dialog>
    <!-- 照片裁切框组 -->
    <!-- on-sure-cut 表示裁剪成功后的回调，返回base64格式的图像 -->
    <!-- on-dialog-close 表示关闭裁剪框后的回调 -->
    <!-- dialogVisible属性决定裁剪框是否可见 -->
    <img-processor
      @on-sure-cut="imgProcess"
      @on-dialog-close="closeImgDialog"
      :dialogVisible="imgProcessorDialogVisible"
    ></img-processor>
  </div>
</template>

<script>
import imgProcessor from "./ImgProcessor";

export default {
  components: {
    "img-processor": imgProcessor
  },
  name: "register",
  props: {
    registerDialogVisible: Boolean
  },
  data() {
    // 验证电话
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
    // 验证密码
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
        userPass: "",
        usericon: ""
      },
      rules: {
        userPass: [{ validator: validatePass, trigger: "blur" }],
        userPhone: [{ validator: validatePhone, trigger: "blur" }]
      },
      // 该注册弹框是否可见
      myRegisterDialogVisible: this.registerDialogVisible,
      // 图片裁剪框是否可见，默认不可见
      imgProcessorDialogVisible: false
    };
  },
  methods: {
    //   提交表单时的处理函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 若符合本地验证，则请求服务器进行注册
        if (valid) {
          // 实例化formData映射对象
          let userForm = new FormData();
          // 映射用户电话
          userForm.append("userPhone", this.user.userPhone);
          // 映射用户密码
          userForm.append("userPass", this.user.userPass);
          // 映射用户头像
          userForm.append("userIcon", this.user.usericon);
          // 发起注册请求
          this.$axios
            .post(this.HOME + "/register", userForm)
            .then(
              function(response) {
                // 获得响应中的数据
                let data = response.data;
                if(data === "SUCCESS"){
                  // 清空用户输入
                  this.user.userPhone = "";
                  this.user.userPass = "";
                  // 提示消息
                  this.$messsage({
                    message:"注册成功",
                    type:"success"
                  });
                }else if(data === "FAIL"){
                  this.$message.error("注册失败");
                }else{
                  this.$message.error("未知错误");
                }
              }.bind(this)
            )
            .catch(err => {
              this.$message.error("服务器未响应");
            });
        } else {
          return false;
        }
      });
    },
    handleSelect(key, keyPath) {},
    // 关闭注册框时的回调函数,通知父组件自己被关闭了，改变当前状态
    handleClose() {
      this.$emit("on-closeRegister", false);
    },
    closeImgDialog(val) {
      // 关闭图片裁剪框时的回调函数
      this.imgProcessorDialogVisible = val;
    },
    // 设置imgProcessorDialogVisible为true 即打开图像裁剪框
    openImgDialog() {
      this.imgProcessorDialogVisible = true;
    },
    imgProcess(val) {
      // 裁剪图片完成后的回调，返回base64格式的图像编码,并显示到输入文本框中
      this.user.usericon = val;
    }
  },
  //   监听父组件的传值
  watch: {
    registerDialogVisible(val) {
      this.myRegisterDialogVisible = val;
    }
  }
};
</script>

<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
/* 用于手机屏幕 */
@media screen and (max-width: 768px) {
  .card-login {
    position: absolute;
    width: 100%;
    height: 60%;
    z-index: 4;
  }
}
/*  用于小平板 */
@media screen and (max-width: 992px) and (min-width: 768px) {
}

/* 用于中大尺寸平板 */
@media screen and (min-width: 992px) and (max-width: 1300px) {
}
</style>