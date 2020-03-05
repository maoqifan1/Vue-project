<template>
  <div class="wrapper-container">
    <div class="card card-dark fade-in-left">
      <div class="card-header">
        <div class="row">
          <div class="col-4 d-flex flex-end align-items-center">
            <!-- 返回搜索好友页面的按钮 -->
            <i
              class="fa fa-chevron-left cur-pointer"
              aria-hidden="true"
              @click="backToFriendReqPage"
            ></i>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <!-- 显示当前页的名称 -->
            <span>好友申请</span>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- 好友申请的具体内容 -->
        <div class="list-group">
          <!-- 头像及用户名 -->
          <div class="list-group-item list-group-item-dark">
            <div class="container-fluid">
              <div class="row align-items-center">
                <!-- 头像 -->
                <div class="col-3">
                  <el-image
                    style="width:2.8rem;height:2.8rem;margin-top:6px"
                    fit="cover"
                    :src="my_friend_request.icon"
                  ></el-image>
                </div>
                <!-- 名称 -->
                <div class="col-9">
                  <span class="font-dark" v-html="my_friend_request.name"></span>
                </div>
              </div>
              <!-- row结束 -->
            </div>
          </div>
          <!-- list-group-item 结束-->
          <!-- 请求的具体内容 -->
          <div class="list-group-item list-group-item-dark">
            <div class="container-fluid">
              <div class="row">
                <div class="col-3">
                  <span class="font-dark font-small">附加消息</span>
                </div>
                <div class="col-9">
                  <span
                    class="font-dark font-small"
                    v-html="my_friend_request.req_tail===null?'请求添加好友':my_friend_request.req_tail"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <!-- list-group-item结束 -->
          <!-- 请求的来源 -->
          <div class="list-group-item list-group-item-dark">
            <div class="container-fluid">
              <div class="row">
                <div class="col-3">
                  <span class="font-dark font-small">来源</span>
                </div>
                <div class="col-9">
                  <span class="font-dark font-small">好友搜索</span>
                </div>
              </div>
            </div>
          </div>
          <!-- list-group-item结束 -->
        </div>
        <!-- list-group 结束 -->
        <!-- 若好友消息已读则提示已处理则提示 -->
        <div class="d-flex justify-content-center" v-if="isRequestHandled">
          <span class="font-dark font-small m-2">请求已处理</span>
        </div>
      </div>
      <!-- card-body 结束 -->
      <!-- 好友请求操作栏 若好友请求已处理则不显示 -->
      <div class="card-footer" v-if="!isRequestHandled">
        <div class="row justify-content-center">
          <div class="col-4 d-flex justify-content-center">
            <button class="btn btn-pink" @click="handleWithRequest('agree')">同意</button>
          </div>
          <div class="col-4 d-flex justify-content-center">
            <button class="btn btn-pink" @click="handleWithRequest('disagree')">拒绝</button>
          </div>
        </div>
      </div>
    </div>
    <!-- card结束 -->
    <!-- 确认添加好友弹窗 要求输入确认信息 -->
    <el-dialog title="好友设置" :visible.sync="isConfirmReqDialog">
      <!-- 设置备注和分组 -->
      <div class="row group-select">
        <el-input placeholder="备注" v-model="friend_remark"></el-input>
        <el-select v-model="user_group_id" placeholder="分组">
          <!-- 动态输出当前用户所具有的分组的选项 -->
          <el-option
            v-for="(group, index) in user_group"
            :key="index"
            :label="group.name"
            :value="group.id"
          ></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-pink" @click="handleWithRequest('submit')">确认</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- wrapper-container结束 -->
</template>

<script>
export default {
  props: {
    //   传入用户对象，属性分别为
    /*  id: 0,  发送请求的用户的id
        icon: "",  发送请求的用户的头像
        name: "",  发送请求的用户的名称
        req_tail: ""  请求的具体内容
        req_state:""  请求的状态
        */
    friend_request: Object
  },
  created() {
    // 若req_state为ur表示当前请求未读
    this.my_friend_request.req_state === "ur"
      ? (this.isRequestHandled = false)
      : (this.isRequestHandled = true);
  },
  data() {
    return {
      my_friend_request: this.friend_request, // 创建本地副本
      isRequestHandled: true, // 判断当前请求是否被处理过,默认为处理过
      isConfirmReqDialog: false, // 表示确认添加好友弹窗是否渲染
      user_group: this.$USER_GROUP, // 表示当前用户的所有分组
      friend_remark: "", // 暂时存放当前用户给好友的备注
      user_group_id: "" // 暂时存放当前用户给好友设置的分组的id
    };
  },
  methods: {
    // 返回显示所有好友请求的页面
    backToFriendReqPage() {
      this.$emit("on-back-friendreq-page", true);
    },
    // 处理好友请求所需要执行的函数
    // 若参数cmd为agree表示同意，cmd为disagree表示拒绝 , submit表示提交
    handleWithRequest(cmd) {
      if (cmd === "disagree") {
        // 调用方法上传
        // 第二个参数为uSendId表示发送好友请求的用户的id
        this.handleWithRequestToServer("disagree", this.my_friend_request.id);
      } else if (cmd === "agree") {
        // 从服务器端获取当前用户信息
        this.$getCurrentUserGroupInfoFromServer();
        // 显示确认弹窗
        this.isConfirmReqDialog = true;
      } else if (cmd === "submit") {
        if (this.user_group_id === null || this.user_group_id.trim() === "") {
          this.$message.error("请输入完整信息");
          return;
        }
        // 调用函数上传服务器
        // 若第一个参数为 agree表示同意且获取第二和第三个参数和第四个参数
        // 第二个参数为uSendId表示发送好友请求的用户的id
        // 第三个参数为当前用户对发送好友请求用户的备注
        // 第四个参数为当前用户对发送好友请求用户的分组的id
        this.handleWithRequestToServer(
          "agree",
          this.my_friend_request.id,
          this.friend_remark,
          this.user_group_id
        );
      }
    }
  },
  computed: {
    handleWithRequestToServer() {
      return function() {
        // 创建FormData对象
        let form = new FormData();
        let u_wish = arguments[0];
        let u_send_id = arguments[1];
        // 若第一个参数为 agree表示同意且获取第二和第三个参数和第四个参数
        // 第二个参数为uSendId表示发送好友请求的用户的id
        // 第三个参数为当前用户对发送好友请求用户的备注
        // 第四个参数为当前用户对发送好友请求用户的分组的id
        if (u_wish === "agree") {
          let u_accept_remark = arguments[2];
          let u_accpet_group_id = Number.parseInt(arguments[3]);
          // 映射参数
          form.append("uWish", u_wish);
          form.append("uSendId", u_send_id);
          form.append("uAcceptRemark", u_accept_remark);
          form.append("uAcceptGroupId", u_accpet_group_id);
          // 调用axios发起POST请求
          this.$axios
            .post(this.HOME + "/fr/handle", form)
            .then(res => {
              // 获得响应的数据部分
              let data = res.data;
              if (data.includes("SUCCESS")) {
                // 使添加按钮不可见
                this.isRequestHandled = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              } else if (data.includes("EMPTY_INPUT")) {
                this.$message.error("请检查输入");
              } else {
                this.$message.error("错误");
              }
            })
            .catch(err => {
              console.error(err);
              this.$message.error("出现错误,请重试");
            });
        }
        // 若第一个参数为disagree表示拒绝
        // 第二个参数为uSendId表示发送好友请求的用户的id
        else if (u_wish === "disagree") {
          // 映射参数
          form.append("uWish", u_wish);
          form.append("uSendId", u_send_id);
          // 调用axios发起post请求
          this.$axios
            .post(this.HOME + "/fr/handle", form)
            .then(res => {
              let data = res.data;
            })
            .catch(err => {
              console.error(err);
              this.$message.error("出现错误,请重试");
            });
        }
      };
    }
  },
  watch: {
    // 监听父组件传值
    friend_requst(val) {
      this.my_friend_request = val;
    }
  }
};
</script>

<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
@import url("../../static/font-awesome-4.7.0/css/font-awesome.css");
.list-group-item-dark {
  border-bottom: 0;
}
.list-group-item-dark:hover,
.list-group-item-dark:visited {
  background: rgb(38, 38, 38) !important;
  border-bottom: 0;
}
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
  width: 100% !important;
}
</style>