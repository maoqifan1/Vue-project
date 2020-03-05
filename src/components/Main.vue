<template>
  <div class="wrapper-container">
    <div class="card card-dark">
      <article class="card-body no-padding overflow-auto">
        <!-- 聊天页面
        @on-chat-start 表示用户在发起与一个好友的聊天后的回调
        @get-con-friend-id 返回与当前用户有会话的好友的id的数组
        :user_friends 绑定用户好友数组
        :user_conversions 绑定用户会话对象数组
     };
        -->
        <chat-list-module
          v-show="active_index == 0 && !isChat && !isFriendReqPage && !isFriendInfoPage"
          @on-chat-start="processChatStart"
          :user_friends="this.$USER_FRIENDS_INFO"
          :user_conversions="this.$USER_CONS_INFO"
        ></chat-list-module>
        <!-- 好友页面
        @on-friendreq-page-open 表示用户点击查看好友请求页面后的回调函数 
        @on-friendinfo-page-open 表示用户点击查看好友信息页面后的回调函数
         接收两个参数 bool参数表示页面打开，第二个参数中存放好友信息对应属性格式如下
          friend_id 好友id friend_name  好友名称 friend_icon 好友的头像
             friend_remark 好友的备注 friend_group_id  好友所在分组的id
             friend_group_name 好友所在分组的名称 
             :user_friends 绑定用户好友数组
             :user_groups  绑定用户分组数组
        -->
        <friend-list-module
          v-show="active_index == 1 && !isChat && !isFriendReqPage && !isFriendInfoPage"
          :user_friends="this.$USER_FRIENDS_INFO"
          :user_groups="this.$USER_GROUP"
          @on-friendreq-page-open="processFriendReqPageOpen"
          @on-friendinfo-page-open="processFriendInfoPageOpen"
        ></friend-list-module>
        <!-- 与指定好友聊天的窗口 
        :isRender属性表示是否渲染该聊天界面
        @on-back-list表示用户在聊天窗口点击返回后的事件
        :friend_info绑定好友的信息对象
          friend_id 好友id friend_name  好友名称 friend_icon 好友的头像
             friend_remark 好友的备注 friend_group_id  好友所在分组的id
             friend_group_name 好友所在分组的名称 
             :web_socket 对象
             :user_info 传递当前用户对象信息
        -->
        <chat-window-module
          v-if="isChat"
          :friend_info="friend_info"
          @on-back-list="processChatClose"
          :user_info="this.$USER_INFO"
        ></chat-window-module>
        <!-- 好友请求展示页
        @on-back-list 表示用户在查看好友请求页面点击返回后的回调 
        -->
        <friend-req-module v-if="isFriendReqPage" @on-back-list="processFriendReqPageClose"></friend-req-module>
        <!--  好友信息详情页 
        @on-back-list 表示用户在好友信息页点击返回后的回调函数
        :friend_info 绑定好友信息对象
        @on-chat-start 表示用户开始聊天后的回调函数
        :friend_id_arr 绑定存储所有与当前用户有会话的好友的id的数组
        -->
        <friend-info-module
          v-if="isFriendInfoPage"
          @on-back-list="processFriendInfoPageClose"
          :friend_info="friend_info"
          @on-chat-start="processChatStart"
          :friend_id_arr="this.$CON_FRIEND_ID_INFO"
        ></friend-info-module>
        <!-- 个人设置页面 -->
        <settings-module
          v-show="active_index == 2 && !isChat && !isFriendReqPage && !isFriendInfoPage"
        ></settings-module>
      </article>
      <!-- 在与用户聊天时不显示 -->
      <footer
        v-if="!isChat && !isFriendReqPage && !isFriendInfoPage"
        class="card-footer no-padding"
      >
        <!-- 底部导航 -->
        <nav class="nav nav-dark nav-pills nav-fill">
          <!-- 渲染导航菜单的具体自选项 -->
          <a
            v-for="(nv, index) in nav"
            class="nav-item nav-link"
            :class="{'active':(active_index==index)}"
            @click="active_index = index"
            :key="index"
          >
            <!-- 导航的图标 -->
            <i :class="nv.icon" style="font-size:1.5rem" aria-hidden="true"></i>
            <br />
            <!-- 导航的名称 -->
            <span style="font-size:0.8rem" v-html="nv.name"></span>
          </a>
        </nav>
      </footer>
    </div>
  </div>
</template>
<script>
import FriendList from "./FriendList";
import ChatList from "./ChatList";
import Settings from "./Settings";
import Chat from "./Chat";
import FriendReq from "./FriendReq";
import FriendInfo from "./FriendInfo";
export default {
  // 需要用到的组件
  components: {
    "friend-list-module": FriendList, // 好友列表组件模块
    "chat-list-module": ChatList, // 聊天列表组件模块
    "chat-window-module": Chat, // 与好友聊天时界面组件模块
    "friend-req-module": FriendReq, // 好友请求展示模块
    "friend-info-module": FriendInfo, //好友详细信息模块
    "settings-module": Settings // 用户设置组件模块
  },
  created() {
    // 从服务器端获得用户信息
    // 对应this.$USER_INFO对象
    this.$getCurrentUserInfoFromServer();
    // 从服务器端获得当前用户的所有好友的信息的数组
    // 对应this.$USER_FRIENDS_INFO 数组
    this.$getCurrentUserFriendsInfoFromServer();
    // 从服务器端获取当前用户所有的会话信息
    // 对应this.$USER_CONS_INFO 数组
    // 对应this.$CON_FRIEND_ID_INFO
    this.$getCurrentUserConversionInfoFromServer();
    // 从服务器端获取当前用户所有的分组信息
    // 对应this.$USER_GROUP 数组
    this.$getCurrentUserGroupInfoFromServer();
    // 开始socket
    // 判断当前浏览器是否支持websocket对象
    // if ("WebSocket" in window) {
    //   // 建立连接
    //   this.WEB_SOCKET = new WebSocket(this.SOCKET_HOME + "/chat");
    // } else {
    //   console.log("sockjs");
    //   // 使用sockjs建立连接
    //   this.WEB_SOCKET = new SockJS(this.HOME + "/sockjs/chat");
    // }
    // // 建立连接时
    // this.WEB_SOCKET.onopen = event => {
    //   console.log("连接成功");
    // };
    // // 收到消息时
    // this.WEB_SOCKET.onmessage = event => {
    //   // 处理聊天消息
    //   this.handleCurUserMessages(event.data);
    // };
    // // 错误时,暂时不处理
    // this.WEB_SOCKET.onerror = event => {};
    // // 关闭连接时，提示用户
    // this.WEB_SOCKET.onclose = event => {
    //   console.log("断开连接");
    // };
  },
  data() {
    return {
      active_index: 0, // acitveIndex为0表示默认当前获得焦点的为聊天列表页面
      nav: [
        { name: "交谈", icon: "fa fa-comments-o" },
        { name: "好友", icon: "fa fa-user-o" },
        { name: "设置", icon: "fa fa-cog" }
      ], // 导航菜单的具体名称和图标
      isChat: false, // 判断用户当前是否点击与某一好友的会话，若点击isChat则为true
      isFriendReqPage: false, // 判断用户当前是否在查看好友请求页
      isFriendInfoPage: false, // 判断用户当前是否在查看好友详细信息页面
      friend_info: {}, // 保存好友信息
      // friend_id_arr: [] // 存储所有与当前用户有会话的好友的id
      // websocket: "", // websocket对象
      one_message: ""
    };
  },
  methods: {
    getParams() {
      // 取到路由从登录界面带过来的参数
      let result = this.$route.params.result;
      this.$message({
        message: result,
        type: "success"
      });
    },
    // 处理聊天事件
    processChatStart(isOpen, friend_info) {
      // 关闭用户信息界面
      this.isFriendInfoPage = false;
      // 获取子组件传来的用户对象
      this.friend_info = friend_info;
      this.isChat = isOpen;
    },
    // 关闭聊天页面后的回调函数
    processChatClose(isClose) {
      if (isClose) {
        // 关闭聊天界面
        this.isChat = false;
        // 判断用户信息界面是否打开若打开则关闭
        this.isFriendInfoPage = false;
        // 固定焦点到聊天页面
        this.active_index = 0;
      } else {
        this.isChat = true;
      }
    },
    // 打开好友请求页面
    processFriendReqPageOpen(isOpen) {
      this.isFriendReqPage = isOpen;
    },
    // 关闭查看好友请求页面后的回调函数
    processFriendReqPageClose(isClose) {
      this.isFriendReqPage = !isClose;
    },
    // 打开查看好友信息页面的回调函数
    //第一个参数为bool值表示是否打开页面  第二个参数为friend对象
    processFriendInfoPageOpen(isOpen, friend_info) {
      if (isOpen) {
        this.isFriendInfoPage = true;
        // 将好友信息保存到本地变量中
        this.friend_info = friend_info;
      } else {
        this.isFriendInfoPage = false;
      }
    },
    // 关闭查看好友信息页面后的回调函数
    processFriendInfoPageClose(isClose) {
      this.isFriendInfoPage = !isClose;
    },
    // 对当前数据进行处理
    handleCurUserMessages(Messages) {
      console.log(Messages);
      let _messages = JSON.parse(Messages);
      //type为one时表示收到一条消息
      if (_messages.type === "one") {
        let _message_datum = _messages.message;
        // this.all_messages.push({
        //   mess_send_u_id: _message_datum.messageUSendId, // 发送信息的用户id
        //   mess_recv_u_id: _message_datum.messageURecvId, // 接收信息的用户id
        //   mess_send_u_icon: _message_datum.messageUSendIcon, // 发送信息的用户头像
        //   mess_recv_u_icon: this.$USER_INFO.user_icon, // 接收信息的用户头像(本用户)
        //   mess_content: _message_datum.message // 消息
        // });
        this.$notify({
          title: "来自" + _message_datum.messUSendId,
          message: _message_datum.message
        });
        // 当收到所有消息记录时
      } else if (_messages.type === "all") {
        // 获得信息的数据部分
        let _messages_data = _messages.message;
        // 将数据部分将入到本地数据集中
        // _messages_data.map(message=>{
        //   this.all_messages.push({
        //     mess_send_u_id:message.messSendUId,  // 发送消息的用户id
        //     mess_recv_u_id:message.messRecvUId,  // 接收消息的用户id
        //     mess_send_u_icon:message.messSendUIcon, // 发送消息的用户头像
        //     mess_recv_u_icon:message.messRecvUIcon, // 接收消息的用户头像
        //     mess_content:message.messTails // 消息的具体内容
        //   })
        // });
      }
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法
    $route: "getParams"
  }
};
</script>
<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
@import url("../../static/font-awesome-4.7.0/css/font-awesome.css");
.card-body {
  padding-bottom: 0px;
}
.nav-dark .nav-item {
  padding: 0.4rem;
}
</style>