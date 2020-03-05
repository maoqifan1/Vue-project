/* jshint esversion:6 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'default-passive-events';
// 自定义移动端指令
import "./vue-touch.js";
// 引入jquery
import $ from 'jquery';
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/element.css';
import App from './App';
import router from './router';
import axios from 'axios';
// 使用vuex进行状态管理
import store from './store/index';
// 全局引入bootstrap4
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
// 导入socket模块
// import VueNativeSock from 'vue-native-websocket';
// 使用elementUi
Vue.use(ElementUI);
// // 使用vuenativesock模块
// Vue.use(VueNativeSock, "ws://localhost:8083/chat", {
//   reconnection: true, // 自动重连
//   reconnectionAttempts: 5, // 尝试次数5次
//   reconnectionDelay: 3000, // 重连延迟3秒
// });
Vue.config.productionTip = false;
// 将用户信息绑定到vue对象
Vue.prototype.$USER_INFO = {};
// 将用户分组数组绑定到vue对象
Vue.prototype.$USER_GROUP = [];
// 将用户好友数组绑定到vue对象
Vue.prototype.$USER_FRIENDS_INFO = [];
// 将用户当前拥有的所有会话绑定到vue对象
Vue.prototype.$USER_CONS_INFO = [];
// 将与当前用户有会话的所有的用户的id绑定到vue对象
Vue.prototype.$CON_FRIEND_ID_INFO = [];
//把axios挂载到vue的原型中
Vue.prototype.$axios = axios;
// 将WEB_SOCKET挂载到原型中
Vue.prototype.WEB_SOCKET="";
// 映射路径
Vue.prototype.HOME = '/api';
// 映射websocket通信路径
Vue.prototype.SOCKET_HOME = "ws://localhost:8083";
// 用于websocket通信
//Vue.prototype.HOME = '/api'是一个定值，默认指向localhost，所有修改指向路径为'/api'，配置文件index.js定义的可跨域路径
Vue.prototype.$generateTime = function () {
  var now = new Date();
  var yy = now.getFullYear(); //年
  var mm = now.getMonth() + 1; //月
  var dd = now.getDate(); //日
  var hh = now.getHours(); //时
  var ii = now.getMinutes(); //分
  var ss = now.getSeconds(); //秒
  var clock = yy + '-';
  if (mm < 10) clock += '';
  clock += mm + '-';
  if (dd < 10) clock += '0';
  clock += dd + ' ';
  if (hh < 10) clock += '0';
  clock += hh + ':';
  if (ii < 10) clock += '0';
  clock += ii + ':';
  if (ss < 10) clock += '0';
  clock += ss;
  return clock;
};
// 用于获取对象相对于数组的索引
Vue.prototype.$findIndex = function (arr, obj) {
  {
    let objStr = JSON.stringify(obj);
    return arr.reduce((index, ele, i) => {
      if (JSON.stringify(ele) === objStr) {
        return i;
      } else {
        return index;
      }
    }, -1);
  }
};
// 判断是否显示当前页的函数，用于与分页插件配合
// 参数为 表格中当前行的索引，当前页的索引，每页显示的数量
Vue.prototype.whetherShowPage = function (index, cur, dataPerPage) {
  // 获取初始元素的索引
  let startIndex = (cur - 1) * dataPerPage;
  // 获取最后一个元素的索引
  let endIndex = startIndex + (dataPerPage - 1);
  // 判断这个页面是否该显示
  return startIndex <= index && index <= endIndex ? true : false;
};
// 从服务器端获取当前用户的用户信息
Vue.prototype.$getCurrentUserInfoFromServer = function () {
  this.$axios.get(this.HOME+"/user/info")
    .then(function (res) {
      // 获得响应的数据部分
      let data = res.data;
      if (data.includes("ERROR")) {
        this.$message.error("请登录");
      }
      else {
        //格式化数据对象
        let user_info = JSON.parse(data);
        this.$USER_INFO = {
          user_id: user_info.uId, // 用户id
          user_icon:user_info.uIcon, // 用户头像
          user_name: user_info.uName, // 用户名
          user_phone: user_info.uPhone // 用户电话
        };
      }
    }.bind(this))
    .catch(err => {
      console.error(err);
    });
};

// 从服务器端获得当前用户所有分组
Vue.prototype.$getCurrentUserGroupInfoFromServer = function () {
  this.$axios
    .get(this.HOME + "/user/group")
    .then(
      function (response) {
        let data = response.data;
        if (data.includes("ERROR")) {
          this.$message.error("请登录");
        } else {
          // 清空当前数组
          this.$USER_GROUP.splice(0, this.$USER_GROUP.length);
          // 获得用户数据
          let user_group = JSON.parse(data);
          // 设置用户分组的格式
          // 先拆分成groupId:groupName的形式
          let groups_arr = user_group.split(",");
          groups_arr.map(group => {
            // 分别拆成groupId 和 groupName
            let group_arr = group.split(":");
            // 分别赋值给变量
            let group_id = group_arr[0];
            let group_name = group_arr[1];
            // 加入到user_info的user_group对象数组中
            this.$USER_GROUP.push({
              id: group_id,
              name: group_name
            });
          });
        }
      }.bind(this)
    )
    .catch(err => {
      console.log(err);
      this.$message.error("发生错误");
    });
};

// 从服务器端获得当前用户的所有好友信息
Vue.prototype.$getCurrentUserFriendsInfoFromServer = function () {
  this.$axios
    .get(this.HOME + "/friends")
    .then(
      function (res) {
        // 获得响应的数据部分
        let data = res.data;
        // 当数据集为空时不提示
        if (data.includes("EMPTY_LIST")) {
          console.log("当前用户无好友");
        } else {
          // 格式化数据对象
          let friend_list = JSON.parse(data);
          // 清空当前数组
          this.$USER_FRIENDS_INFO.splice(0, this.$USER_FRIENDS_INFO.length);
          friend_list.map(friend => {
            // 将数据加入到保存用户好友数据的数组中
            this.$USER_FRIENDS_INFO.push({
              friend_id: friend.fId, // 好友id
              friend_name: friend.fName, // 好友名称
              friend_icon: friend.fIcon, // 好友的头像
              friend_remark: friend.fRemark, // 好友的备注
              friend_group_id: friend.uGpId, // 好友所在分组的id
              friend_group_name: friend.uGpName // 好友所在分组的名称
            });
          });
        }
      }.bind(this)
    )
    .catch(err => {
      this.$message.error("获得好友信息出错");
    });
};
//从服务器获取当前用户所有的会话信息并加入到本地对象中
Vue.prototype.$getCurrentUserConversionInfoFromServer = function () {
  // 调用axios发起get请求
  this.$axios.get(this.HOME + "/cons")
    .then(function (result) {
      // 获取响应的数据部分
      let data = result.data;
      // 如果为空集合,则输出到控制台
      if (data.includes("EMPTY_LIST")) {
        console.log("当前用户还没有创建会话");
      } else {
        this.$USER_CONS_INFO.splice(0, this.$USER_CONS_INFO.length);
        let user_cons = JSON.parse(data);
        // 将会话对象保存到本地会话对象数组中
        user_cons.map(con => {
          this.$USER_CONS_INFO.push({
            f_id: con.friUId,   // 会话的好友的id
            u_con_state: con.curUState, // 当前用户的会话窗口的状态
            f_con_state: con.friUState, // 好友的会话窗口的状态
          });
          // 会话的好友的id
          this.$CON_FRIEND_ID_INFO.push(con.friUId);
        });
      }
    }.bind(this))
    .catch(err => {
      this.$message.error("获取会话失败，请刷新后重试");
    });
};



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App: App },
  template: '<App/>',
});
