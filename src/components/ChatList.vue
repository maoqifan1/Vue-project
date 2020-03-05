<template>
  <div class="card card-dark">
    <div class="card-header">交谈</div>
    <div class="card-body overflow-auto no-padding">
      <div class="list-group list-group">
        <a
          class="list-group-item list-group-item-dark"
          v-for="(friend, index) in my_user_friends"
          :key="index"
          @click="chatStart(friend)"
          v-swipeleft="(e)=>swipeLeft('滑左',e)"
          href="javascript:void(0);"
        >
          <div class="container-fluid">
            <div class="row">
              <div class="col-3">
                <el-image
                  style="width:2.8rem;height:2.8rem"
                  fit="cover"
                  :src="friend.friend_icon"
                ></el-image>
              </div>
              <div class="col-9">
                <div
                  class="row"
                  v-html="friend.friend_remark===''?friend.friend_name:friend.friend_remark"
                ></div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    /*
    用户好友对象的数组 格式如下
      friend_id 好友id
      friend_name  好友名称
      friend_icon 好友的头像
      friend_remark 好友的备注
      friend_group_id  好友所在分组的id
      friend_group_name 好友所在分组的名称
      */
    user_friends: Array,
    /*用户会话对象数组 格式如下
     f_id  会话的好友的id
    u_con_state 当前用户的会话窗口的状态
    f_con_state 好友的会话窗口的状态
    */
    user_conversions: Array
  },
  data() {
    return {
      my_user_friends: this.user_friends, // 存储当前用户的所有好友
      my_user_conversions: this.user_conversions // 存储当前用户的所有会话对象
    };
  },
  methods: {
    // 弹出用户聊天窗口
    // 参数为朋友对象
    chatStart(friend) {
      // 添加事件，并将朋友对象作为参数传入
      this.$emit("on-chat-start", true, friend);
    },
    swipeLeft(friend, evt) {
      console.log("fuck");
    }
  },
  watch: {
    // 监听父组件传值
    user_friends(val) {
      this.my_user_friends = val;
    },
    user_conversions(val) {
      this.user_conversions = val;
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
.list-group-item-dark :first {
  margin-top: 0.1rem;
}
</style>