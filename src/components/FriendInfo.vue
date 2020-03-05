 <template>
  <div class="wrapper-container">
    <div class="card card-dark fade-in-left">
      <div class="card-header">
        <div class>
          <div class="row">
            <div class="col-4 d-flex flex-end align-items-center">
              <!-- 返回聊天界面的按钮 -->
              <i class="fa fa-chevron-left cur-pointer" aria-hidden="true" @click="backToList"></i>
            </div>
            <div class="col-4 d-flex justify-content-center align-items-center">
              <!-- 显示当前页的名称 -->
              <span v-html="my_friend_info.friend_remark===''?my_friend_info.friend_name:my_friend_info.friend_remark"></span>
            </div>
            <div class="col-4 d-flex justify-content-end align-items-center">
              <span>设置</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- <el-image style="width:100%;height:50%" fit="cover" src="../assets/back.jpg"></el-image> -->
      </div>
      <div class="card-footer">
        <button class="btn btn-pink full-size" @click="sendMessageToFriend">发送消息</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    /*
      friend_id 好友id
      friend_name  好友名称
      friend_icon 好友的头像
      friend_remark 好友的备注
      friend_group_id  好友所在分组的id
      friend_group_name 好友所在分组的名称
      */
    friend_info: Object, // 好友信息对象
    friend_id_arr: Array // 存储所有与当前用户有会话的好友的id
  },
  created() {},
  data() {
    return {
      my_friend_info: this.friend_info, // 创建好友信息对象的本地副本
      my_friend_id_arr: this.friend_id_arr
    };
  },
  methods: {
    // 返回主界面的函数
    backToList() {
      this.$emit("on-back-list", true);
    },
    // 发送消息给朋友按钮的回调
    // 发送消息给父组件 表示开始聊天
    sendMessageToFriend() {
      // 第一个参数为bool表示开始聊天
      // 传递参数为好友的信息的对象
      this.$emit("on-chat-start", true, this.friend_info);
      // 判断当前好友id是否在friend_id_arr中
      // 若有则表示与当前用户已经开始了会话，则不重复创建
      let hasCon = this.my_friend_id_arr.reduce((flag, friend_id) => {
        return this.my_friend_info.friend_id === friend_id;
      }, false);
      if (!hasCon) {
        // 调用api将会话信息上传到服务器
        this.sendCurrentUserConversionInfoToServer(
          this.my_friend_info.friend_id
        );
      }
    }
  },
  computed: {
    // 向服务器发送一条消息表示为当前用户和指定好友添加一个会话
    // 参数为好友的id
    sendCurrentUserConversionInfoToServer() {
      return function(friend_id) {
        let form = new FormData();
        // 映射好友id
        form.append("friendId", friend_id);
        //调用axios发起post请求
        this.$axios
          .post(this.HOME + "/con", form)
          .then(res => {
            let data = res.data;
            if (data.includes("ERROR")) {
              this.$message.error("发起会话失败");
            }
          })
          .catch(err => {
            console.error(err);
          });
      };
    }
  },
  watch: {
    // 监听从父组件的传值, 动态更新对象
    friend_info(val) {
      this.my_friend_info = val;
    },
    friend_id_arr(val) {
      this.my_friend_id_arr = val;
      console.log(val);
    }
  }
};
</script>

<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
@import url("../../static/font-awesome-4.7.0/css/font-awesome.css");
.card-header {
  background-color: transparent;
}
</style>