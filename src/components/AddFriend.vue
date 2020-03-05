<template>
  <div class="card card-dark fade-in-bottom">
    <div class="card-header">
      <div class="row">
        <div class="col-4 d-flex flex-end align-items-center">
          <!-- 返回搜索好友页面的按钮 -->
          <i
            class="fa fa-chevron-left cur-pointer"
            aria-hidden="true"
            @click="backToSearchFriendPage"
          ></i>
        </div>
        <div class="col-4 d-flex justify-content-center align-items-center">
          <!-- 显示当前页的名称 -->
          <span>添加好友</span>
        </div>
        <div class="col-4 d-flex justify-content-end align-items-center">
          <!-- 发送好友请求的按钮 -->
          <a class="btn-link-pink" href="javascript:void(0)" @click="sendFriendRequest">发送</a>
        </div>
      </div>
    </div>
    <div class="card-body full-screen">
      <!-- 好友信息展示 -->
      <div class="row m-bottom-20">
        <!-- 用户头像 -->
        <div class="col-3">
          <el-image style="width:3rem;height:3rem" fit="cover" :src="friend_request.my_friend_icon"></el-image>
        </div>
        <!-- 用户名 -->
        <div class="col-9">
          <span class="font-dark" v-html="friend_request.my_friend_name"></span>
        </div>
      </div>
      <!-- 填写验证信息 -->
      <div class="row m-bottom-20">
        <span class="font-dark font-small m-1">填写验证信息</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请填写验证信息"
          v-model="friend_request.req_details"
          maxlength="100"
        ></el-input>
      </div>
      <!-- 设置备注和分组 -->
      <div class="row group-select">
        <span class="font-dark font-small m-1">设置备注和分组</span>
        <el-input placeholder="备注" v-model="friend_request.firend_remark"></el-input>
        <el-select v-model="friend_request.friend_group_id" placeholder="分组">
          <!-- 动态输出当前用户所具有的分组的选项 -->
          <el-option
            v-for="(group, index) in user_group"
            :key="index"
            :label="group.name"
            :value="group.id"
          ></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    // 初始化用户信息
    this.initData();
    // 从服务器端获取当前用户信息
    this.$getCurrentUserGroupInfoFromServer();
  },
  props: {
    friend_info: Object // 接收从父组件传过来的将要添加为好友的用户的id
  },
  data() {
    return {
      user_group: this.$USER_GROUP, //当前用户分组的数组 元素为 {id: ,name: }
      friend_request: {
        my_friend_id: this.friend_info.friend_id, // 好友的id
        my_friend_name: this.friend_info.friend_name, // 好友的昵称
        my_friend_icon: this.friend_info.friend_icon, //好友的头像
        req_details: "", // 请求填写的内容(可以为空)
        friend_remark: "", // 给好友的备注(可以为空)
        friend_group_id: "" // 给好友的分组的id
      }
    };
  },
  methods: {
    // 返回好友请求页面的函数
    backToSearchFriendPage() {
      if (arguments.length === 0) {
        // 向父组件传值
        this.$emit("on-back-searchfriend-page", true);
      }
      if (arguments.length === 1) {
        this.$emit("on-back-searchfriend-page-success", true, arguments[0]);
      }
    },
    sendFriendRequest() {
      if (
        typeof this.friend_request.my_friend_id === undefined ||
        this.friend_request.my_friend_id === null ||
        this.friend_request.my_friend_id === 0 ||
        typeof this.friend_request.friend_group_id === undefined ||
        this.friend_request.friend_group_id === null ||
        this.friend_request.friend_group_id.trim() === ""
      ) {
        this.$message.error("请输入信息");
        return;
      }
      // 将好友请求上传服务器
      this.sendFriendRequestToServer;
    },
    initData() {
      // 初始化用户信息
      this.friend_request.req_details = "";
      this.friend_request.friend_remark = "";
      this.friend_request.friend_group_id = "";
    }
  },
  computed: {
    // 将好友请求上传至服务器
    sendFriendRequestToServer() {
      // 创建formData对象映射用户的好友请求数据
      let friend_request_form = new FormData();
      // 发送请求的用户分组id
      friend_request_form.append(
        "uSendGroupId",
        Number.parseInt(this.friend_request.friend_group_id)
      );
      // 发送请求的用户对接受请求用户的好友备注
      friend_request_form.append(
        "uSendRemark",
        this.friend_request.friend_remark
      );
      // 接受请求的用户的id
      friend_request_form.append(
        "uAcceptId",
        Number.parseInt(this.friend_request.my_friend_id)
      );
      // 请求的具体内容
      friend_request_form.append("reqTail", this.friend_request.req_details);
      // 发起post请求将数据上传至服务器
      this.$axios
        .post(this.HOME + "/fr/send", friend_request_form)
        .then(
          function(response) {
            // 获得响应的数据部分
            let data = response.data;
            if (data.includes("ERROR")) {
              //如果发送失败,则提示消息
              this.$message.error("发送失败，请稍后再试");
            } else {
              // 成功，则清空数据，并跳转页面
              this.initData();
              // 返回搜索好友页面,并传入参数
              this.backToSearchFriendPage("发送请求成功");
            }
          }.bind(this)
        )
        .catch(err => {
          this.$message.error("发生错误");
          console.error(err);
        });
    }
  },
  watch: {
    // 监听父组件传值，在其更新时动态更新值
    friend_info(val) {
      this.friend_request.my_friend_id = val.friend_id;
      this.friend_request.my_friend_name = val.friend_name;
      this.friend_request.my_friend_icon = val.friend_icon;
    }
  }
};
</script>

<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
@import url("../../static/font-awesome-4.7.0/css/font-awesome.css");
</style>
<style>
input[type="text"]:active,
input[type="text"]:focus {
  box-shadow: 0 0 0 0.0325rem rgb(194, 120, 120) !important;
}
input[placeholder="备注"] {
  border-radius: 4px 4px 0 0;
  border-top-color: transparent !important;
  margin-bottom: 1px;
}
input[placeholder="分组"] {
  border-radius: 0 0 4px 4px;
  border-top-color: transparent !important;
}
/* 设置el-select沾满宽度 */
.group-select .el-select,
.group-select .el-select .el-input.el-input--suffix {
  width: 100%;
}
</style>