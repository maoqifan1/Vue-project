<template>
  <div class="card card-dark fade-in-left">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <!-- 返回聊天界面的按钮 -->
        <i class="fa fa-chevron-left" aria-hidden="true" @click="backToList"></i>
        <!-- 显示用户名 -->
        <span
          v-html="my_friend_info.friend_remark===''?my_friend_info.friend_name:my_friend_info.friend_remark"
        ></span>
        <span>&nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <div v-for="(message, index) in all_messages" :key="index">
        <!-- 如果发送消息的用户本人 ，则将泡泡显示在右边-->
        <div
          class="row d-flex justify-content-end"
          v-if="message.mess_send_u_id === my_user_info.user_id"
        >
          <div class="bubble right">
            <div v-html="message.mess_content"></div>
          </div>
          <el-image
            style="width:2.3rem;height:2.3rem;border-radius:10px;"
            fit="cover"
            :src="my_user_info.user_icon"
          ></el-image>
        </div>
        <!-- row结束-->
        <!-- 如果发送消息的是好友 ，则将泡泡显示在左边-->
        <div
          class="row d-flex justify-content-start"
          v-else-if="message.mess_send_u_id === my_friend_info.friend_id"
        >
          <el-image
            style="width:2.3rem;height:2.3rem;border-radius:10px;"
            fit="cover"
            :src="friend_info.firend_icon"
          ></el-image>
          <div class="bubble left">
            <div v-html="message.mess_content"></div>
          </div>
        </div>
        <!-- row结束-->
      </div>
    </div>
    <!-- card-footer -->
    <div class="card-footer">
      <!-- 用户输入信息框 -->
      <div class="row">
        <div class="col-9 col-xs-8">
          <input
            class="form-control input-group"
            v-model="user_text"
            type="text"
            required
            autofocus
            formmethod="post"
            formaction
          />
        </div>
        <div class="col-3 col-xs-4 d-flex align-items-center">
          <!-- 发送信息的按钮 -->
          <button
            class="btn btn-sm btn-pink m-0 fade-in"
            v-if="user_text !== ''"
            @click="sendMessage"
          >发送</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//引入socketjs
import SockJS from "sockjs-client";

export default {
  props: {
    //格式为
    /*
      friend_id 好友id
      friend_name  好友名称
      friend_icon 好友的头像
      friend_remark 好友的备注
      friend_group_id  好友所在分组的id
      friend_group_name 好友所在分组的名称
      */
    friend_info: Object, // 好友对象信息
    /*
     user_id 用户id
     user_icon 用户头像
     user_name 用户名
     user_phone 用户电话
      */
    user_info: Object // 用户对象信息
    // web_socket: WebSocket // 保存websocket对象
  },
  data() {
    return {
      // 创建本地映射
      my_friend_info: this.friend_info,
      my_user_info: this.user_info,
      // my_web_socket: this.web_socket,
      user_text: "", // 用户输入的信息
      all_messages: [] // 存储好友发来的消息和自己发出的消息
    };
  },
  created() {
    // 判断WEB_SOCKET对象是否为空
    // 为空则重新创建
    if ("WebSocket" in window) {
      // 建立连接
      this.WEB_SOCKET = new WebSocket(this.SOCKET_HOME + "/chat");
    } else {
      console.log("sockjs");
      // 使用sockjs建立连接
      this.WEB_SOCKET = new SockJS(this.HOME + "/sockjs/chat");
    }
    // 建立连接时
    this.WEB_SOCKET.onopen = event => {
      console.log("连接成功");
    };
    // 初始化user_text为空
    this.user_text = "";
    this.WEB_SOCKET.onmessage = event => {
      // 处理聊天消息
      this.getMessage(event.data);
    };
  },
  methods: {
    // 用户点击返回按钮的响应事件，使用户退回到聊天列表界面
    backToList() {
      this.$emit("on-back-list", true);
    }, // 用于用户发送信息
    sendMessage() {
      // 映射参数
      let data = {
        message_type: "one", // one表示获取一条消息
        friend_id: this.my_friend_info.friend_id, // 好友id
        user_icon: this.my_friend_info.friend_icon, // 用户头像
        message: this.user_text // 消息
      };
      // 发送消息至服务器
      this.WEB_SOCKET.send(JSON.stringify(data));
      // 加入到集合中
      this.all_messages.push({
        mess_send_u_id: this.my_user_info.user_id, // 用户id
        mess_recv_u_id: this.my_friend_info.friend_id, // 好友id
        mess_send_u_icon: this.my_user_info.user_icon, // 用户头像
        mess_recv_u_icon: this.my_friend_info.friend_icon, // 好友头像
        mess_content: this.user_text // 消息
      });
      // 发送消息后清空聊天框
      this.user_text = "";
    },
    // 在好友发来消息后，将该消息加入消息列表中
    getMessage(Messages) {
      let _messages = JSON.parse(Messages);
      console.log(_messages);
       console.log(_messages.type === "all");
      //type为one时表示收到一条消息
      if (_messages.type === "one") {
        let _message_datum = _messages;
        // 将当前信息加入到信息集合的最后
        this.all_messages.push({
          mess_send_u_id: _message_datum.messageUSendId, // 发送信息的用户id
          mess_recv_u_id: _message_datum.messageURecvId, // 接收信息的用户id
          mess_send_u_icon: _message_datum.messageUSendIcon, // 发送信息的用户头像
          mess_recv_u_icon: this.$USER_INFO.user_icon, // 接收信息的用户头像(本用户)
          mess_content: _message_datum.message // 消息
        });
        // 当收到所有消息记录时
      } else if (_messages.type === "all") {
        // 获得信息的数据部分
        let _messages_data = _messages.message;
        // 将数据部分将入到本地数据集中
        // 先清空当前数据集
        this.all_messages.splice(0, this.all_messages.length);
        //加入数据
        _messages_data.map(message => {
          this.all_messages.push({
            mess_send_u_id: message.messSendUId, // 发送消息的用户id
            mess_recv_u_id: message.messRecvUId, // 接收消息的用户id
            mess_send_u_icon: message.messSendUIcon, // 发送消息的用户头像
            mess_recv_u_icon: message.messRecvUIcon, // 接收消息的用户头像
            mess_date: message.messDate, // 接收消息的时间
            mess_content: message.messTails // 消息的具体内容
          });
        });
        // 通过时间戳排序数组
        this.all_messages.sort(
          (mess1, mess2) => mess1.mess_date - mess2.mess_date
        );
      }
    }
  },
  watch: {
    // 监听，当父组件传值改变时更新数据域
    friend_info(val) {
      this.my_friend_info = val;
    },
    // web_socket(val) {
    //   this.my_web_socket = val;
    // },
    user_info(val) {
      this.my_user_info = val;
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/custom.css");
@import url("../../static/css/element.css");
@import url("../../static/font-awesome-4.7.0/css/font-awesome.css");
</style>
