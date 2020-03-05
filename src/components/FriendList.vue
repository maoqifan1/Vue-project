<template>
  <div class="card card-dark">
    <div class="card-header">好友</div>
    <div class="card-body no-padding overflow-auto">
      <div class="list-group">
        <a
          class="list-group-item list-group-item-dark"
          href="javascript:void(0)"
          @click="goToFriendReqPage"
        >
          <div class="container-fluid">新朋友</div>
        </a>
      </div>
      <!-- 好友分组列表 -->
      <el-collapse v-model="actives" @change="collapseChange">
        <el-collapse-item
          v-for="(group, index) in my_user_groups"
          :key="index"
          :title="group.name"
          :name="group.id"
        >
          <div class="list-group">
            <a
              v
              v-for="(friend, index) in my_user_friends"
              :key="index"
              href="javascript:void(0)"
              class="list-group-item list-group-item-dark"
              @click="goToFriendInfoPage(friend)"
            >
              <div class="container-fluid">
                <div class="row">
                  <div class="col-3">
                    <!-- 显示头像 -->
                    <el-image
                      style="width:2.8rem;height:2.8rem"
                      fit="cover"
                      :src="friend.friend_icon"
                    ></el-image>
                  </div>
                  <!-- 显示对好友的备注 -->
                  <div class="col-9" v-html="friend.friend_remark"></div>
                </div>
              </div>
            </a>
          </div>
        </el-collapse-item>
      </el-collapse>
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
    /*
     用户分组对象数组 格式如下
     id 分组id
     name 分组名
     */
    user_groups: Array
  },
  data() {
    return {
      actives: [],
      my_user_groups: this.user_groups, // 存储当前用户的所有好友分组
      /*
      friend_id 好友id
      friend_name  好友名称
      friend_icon 好友的头像
      friend_remark 好友的备注
      friend_group_id  好友所在分组的id
      friend_group_name 好友所在分组的名称
      */
      my_user_friends: this.user_friends // 存储当前用户的所有好友
    };
  },
  methods: {
    // 当折叠面板状态发生改变时的回调函数
    collapseChange(now_actives) {
      // console.log(now_actives);
    },
    // 当用户点击好友请求链接后的回调函数
    goToFriendReqPage() {
      // 向父组件传值
      this.$emit("on-friendreq-page-open", true);
    },
    // 当用户点击列表下好友的回调 表示查看好友信息,参数为friend对象
    goToFriendInfoPage(friend) {
      // 向父组件传值
      // 第一个参数为布尔值表示显示好友信息页面
      // 第二个参数为friend对象保存好友信息
      this.$emit("on-friendinfo-page-open", true, friend);
    }
  },
  watch: {
    // 监听父组件传值
    user_friends(val) {
      this.my_user_friends = val;
    },
    user_groups(val) {
      this.my_user_groups = val;
    }
  },
  computed: {}
};
</script>
<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
</style>
