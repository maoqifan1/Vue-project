<template>
  <div class="wrapper-container">
    <div class="card card-dark fade-in-left" v-if="!isSearchFriendPage && !isFriendReqDetailPage">
      <div class="card-header">
        <div class>
          <div class="row">
            <div class="col-4 d-flex flex-end align-items-center">
              <!-- 返回聊天界面的按钮 -->
              <i class="fa fa-chevron-left cur-pointer" aria-hidden="true" @click="backToList"></i>
            </div>
            <div class="col-4 d-flex justify-content-center align-items-center">
              <!-- 显示当前页的名称 -->
              <span>新朋友</span>
            </div>
            <div class="col-4 d-flex justify-content-end align-items-center">
              <!-- 
                @click gotoSearchFriend 表示访问添加好友页面
              -->
              <a class="btn-link-pink" href="javascript:void(0)" @click="gotoSearchFriend">添加</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 显示用户收到的好友通知 -->
      <div class="card-body">
        <span class="font-dark font-small m-bottom-20">好友通知</span>
        <!-- 放置好友通知 -->
        <div class="list-group">
          <a
            v-for="(req, index) in friend_requests"
            :key="index"
            href="javascript:void(0)"
            class="list-group-item list-group-item-dark"
          >
            <div class="container-fluid">
              <div class="row align-items-center">
                <!-- 头像 -->
                <div class="col-3">
                  <el-image
                    style="width:2.8rem;height:2.8rem;margin-top:6px"
                    fit="cover"
                    :src="req.u_send_icon"
                  ></el-image>
                </div>
                <!-- 具体信息 -->
                <div class="col-7">
                  <div class="row">
                    <span v-html="req.u_send_name"></span>
                  </div>
                  <div class="row">
                    <span class="font-small font-dark">请求添加好友</span>
                  </div>
                  <div class="row">
                    <span class="font-small font-dark">来源:&nbsp;好友搜索</span>
                  </div>
                </div>
                <!-- 请求信息详情 -->
                <div class="col-2 align-self-center">
                  <!-- @gotoFriendReqDetailPage 表示访问好友请求详情页面 
                  参数分别为 发送请求的用户的id,头像，昵称，请求的内容
                  -->
                  <i
                    class="fa fa-chevron-right"
                    @click="gotoFriendReqDetailPage(req.u_send_id,req.u_send_icon,req.u_send_name,req.req_tails,req.req_state)"
                  ></i>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <!-- 
       @on-back-friendreq-page 为从请求页面返回当前页面事件的回调函数，
      并传bool值表示是否回到当前页面
      :friend_request传入单个好友请求对象
    -->
    <friend-req-detail-module
      v-if="isFriendReqDetailPage"
      @on-back-friendreq-page="processFriendreqDetailPageClose"
      :friend_request="single_friend_request"
    ></friend-req-detail-module>
    <!-- 
      @on-back-friendreq-page 为从搜索好友页面返回当前页面事件的回调函数，
      并传bool值表示是否回到当前页面
    -->
    <search-friend-module
      v-if="isSearchFriendPage"
      @on-back-friendreq-page="processSearchFriendPageClose"
    ></search-friend-module>
  </div>
</template>

<script>
import searchFriend from "./SearchFriend";
import friendReqDetail from "./FriendReqDetail";

export default {
  components: {
    "search-friend-module": searchFriend, // 查找并添加好友的页面
    "friend-req-detail-module": friendReqDetail // 好友请求的详情页面
  },
  created() {
    // 从服务器获取当前用户收到的所有的好友请求
    this.getFriendReqsFromServer;
  },
  data() {
    return {
      isSearchFriendPage: false, // 表示是否显示搜索好友的页面
      isFriendReqDetailPage: false, // 表示是否显示好友请求详情页面
      // 存放所有的好友请求的的对象数组,属性为
      //"reqState","reqTails","sendTime","uSendIcon","uSendId","uSendName"
      friend_requests: [],
      // 用于暂时存放单个好友请求对象
      single_friend_request: {
        id: 0, // 发送请求的用户的id
        icon: "", // 发送请求的用户的头像
        name: "", // 发送请求的用户的名称
        req_tail: "", // 请求的具体内容
        req_state: "" //请求的具体状态
      }
    };
  },
  methods: {
    // 返回主界面的函数
    backToList() {
      this.$emit("on-back-list", true);
    },
    // 点击添加好友选项的回调，即访问搜索好友页面
    gotoSearchFriend() {
      this.isSearchFriendPage = true;
    },
    // 关闭搜索好友页面
    processSearchFriendPageClose(isClose) {
      isClose
        ? (this.isSearchFriendPage = false)
        : (this.isSearchFriendPage = true);
    },
    //访问好友请求详情页面
    //参数分别为 发送请求的用户的id,头像，昵称，请求的内容
    gotoFriendReqDetailPage(id, icon, name, reqTail, reqState) {
      //设置临时对象的属性
      this.single_friend_request.id = Number(id);
      this.single_friend_request.icon = icon;
      this.single_friend_request.name = name;
      this.single_friend_request.req_tail = reqTail;
      this.single_friend_request.req_state = reqState;
      // 设置好友请求详情也可见
      this.isFriendReqDetailPage = true;
    },
    //关闭好友请求详情页面
    processFriendreqDetailPageClose(isClose) {
      isClose
        ? (this.isFriendReqDetailPage = false)
        : (this.isFriendReqDetailPage = true);
    }
  },
  computed: {
    // 从服务器获取当前用户收到的所有的好友请求
    getFriendReqsFromServer() {
      this.$axios
        .get(this.HOME + "/frs")
        .then(
          function(response) {
            // 获得响应的数据部分
            let data = response.data;
            if (data.includes("EMPTY_LIST")) {
            } else {
              let reqs = JSON.parse(data);
              // 遍历请求集合，并将数据加载到本地对象中
              for (let req of reqs) {
                this.friend_requests.push({
                  req_state: req.reqState,
                  req_tails: req.reqTails,
                  send_time: req.sendTime,
                  u_send_icon: req.uSendIcon,
                  u_send_id: req.uSendId,
                  u_send_name: req.uSendName
                });
              }
            }
          }.bind(this)
        )
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
@import url("../../static/font-awesome-4.7.0/css/font-awesome.css");
</style>