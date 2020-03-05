<template>
  <div class="wrapper-container">
    <!-- 在添加好友时，不显示该页面 -->
    <div class="card card-dark fade-in-left" v-if="!isAddFriendPage">
      <div class="card-header">
        <div class>
          <div class="row">
            <div class="col-4 d-flex flex-end align-items-center">
              <!-- 返回好友请求页面的按钮 -->
              <i
                class="fa fa-chevron-left cur-pointer"
                aria-hidden="true"
                @click="backToFriendReqPage"
              ></i>
            </div>
            <div class="col-4 d-flex justify-content-center align-items-center">
              <!-- 显示当前页的名称 -->
              <span>查找用户</span>
            </div>
            <div class="col-4 d-flex justify-content-end align-items-center"></div>
          </div>
        </div>
      </div>
      <div class="card-body full-screen p-0 overflow-auto">
        <div class="card-body">
          <el-input placeholder="请输入内容" v-model="search_input">
            <el-select v-model="search_select" slot="prepend" placeholder="请选择">
              <el-option label="用户名" value="name"></el-option>
              <el-option label="用户电话" value="phone"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searhUsers"></el-button>
          </el-input>
        </div>
        <!-- 结果显示框 -->
        <div class="card-body">
          <!-- 渲染结果数据 -->
          <div v-if="search_data!==null">
            <div class="list-group">
              <!-- 单条用户信息 -->
              <a
                class="list-group-item list-group-item-dark"
                v-for="(user, index) in search_data"
                :key="index"
              >
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-3">
                      <el-image style="width:2.8rem;height:2.8rem" fit="cover" :src="user.icon"></el-image>
                    </div>
                    <div class="col-9">
                      <div class="row" v-html="user.name"></div>
                      <div class="row">
                        <a href="javascript:void(0)" class="btn-link-pink">
                          <!-- gotoAddFriendPage 表示前往添加好友页面的处理函数
                          传参分别为 将要添加用户的id,昵称，头像
                          -->
                          <i
                            @click="gotoAddFriendPage(user.id,user.name,user.icon)"
                            class="fa fa-plus"
                          ></i>
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a
                          href="javascript:void(0)"
                          class="btn-link-pink"
                        >
                          <i class="fa fa-user"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <!--单条用户信息 -->
            </div>
            <!-- 用户信息列表 -->
          </div>
        </div>
        <!-- 结果显示框结束 -->
      </div>
      <!-- 搜索好友页面主体部分 -->
    </div>
    <!-- 添加好友所使用的组件
    on-back-searchfriend-page 事件表示关闭添加好友界面并返回，并返回一个布尔值表示页面是否关闭
    friend_info属性为一个对象表示用户将要添加的好友的信息
    -->
    <add-friend-module
      v-if="isAddFriendPage"
      :friend_info="friend_info"
      @on-back-searchfriend-page="processAddFriendPageClose"
      @on-back-searchfriend-page-success="processAddFriendPageClose"
    ></add-friend-module>
  </div>
  <!-- 总页面结束 -->
</template>

<script>
import AddFriend from "./AddFriend"; // 添加好友所使用的组件

export default {
  components: {
    "add-friend-module": AddFriend
  },
  data() {
    return {
      search_input: "",
      search_select: "",
      // 数据格式为{id:,name:'',phone:'',icon:''}
      search_data: [],
      isAddFriendPage: false, // 判断当前是否处于添加好友页面，默认为否
      // 暂时存储用户将要添加的用户的的信息
      friend_info: {
        friend_id: Number, // 用户id
        friend_name: String, // 用户名
        friend_icon: String // 用户头像
      }
    };
  },
  methods: {
    // 返回好友请求页面的函数
    backToFriendReqPage() {
      // 向父组件传值
      this.$emit("on-back-friendreq-page", true);
    }, //搜索用户时所调用方法
    searhUsers() {
      if (
        this.search_input === null ||
        this.search_input.trim() === "" ||
        this.search_select === null
      ) {
        this.$message.error("请输入信息");
        return;
      }
      // 清空集合
      this.search_data.splice(0, this.search_data.length);
      // 调用方法从服务器搜索
      this.getUserInfoFromServer();
      // 前往添加好友的页面 参数为指定希望添加好友的用户的id
    },
    //参数分别为 将要添加用户的id,昵称，头像
    gotoAddFriendPage(friendId, friendName, friendIcon) {
      // 将好友信息赋值给当前暂时存储用户信息的对象
      this.friend_info.friend_id = friendId;
      this.friend_info.friend_name = friendName;
      this.friend_info.friend_icon = friendIcon;
      // 打开好友页面
      this.friend_id === null
        ? (this.isAddFriendPage = false)
        : (this.isAddFriendPage = true);
    }, // 关闭添加好友页面的回调函数
    processAddFriendPageClose() {
      // 若参数为1个时，则为布尔值表示是否关闭添加好友页面
      // 为两个时，第二个参数为发送好友请求成功后的消息
      this.isAddFriendPage = !arguments[0];
      if (arguments.length === 2 && arguments[2] === "SUCCESS") {
        this.isAddFriendPage = !arguments[0];
        this.$message({
          message: "发送请求成功",
          type: "success"
        });
      }
    }
  },
  computed: {
    // 从服务器搜索用户信息
    getUserInfoFromServer() {
      return function() {
        // 创建formData对象存储数据
        let searchForm = new FormData();
        // 映射搜索内容
        searchForm.append("value", this.search_input);
        // 从服务器端搜索数据
        this.$axios
          .get(this.HOME + "/search/users/" + this.search_select, {
            params: {
              value: this.search_input
            }
          })
          .then(
            function(res) {
              // 获得响应的数据部分
              let data = res.data;
              // 判断数据
              if (data.includes("EMPTY_LIST")) {
                this.$message("未找到该用户");
                // 赋值给本地数组
              } else {
                for (let info of JSON.parse(data)) {
                  this.search_data.push({
                    id: info.uId,
                    name: info.uName,
                    phone: info.phone,
                    icon: info.uIcon
                  });
                }
              }
            }.bind(this)
          )
          .catch(err => {});
      };
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
  /* border-radius: 0 0.25rem 0.25rem 0; */
  box-shadow: 0 0 0 0.0325rem rgb(194, 120, 120) !important;
}
.el-input-group__prepend {
  right: 1.25px;
}
.el-input-group__append {
  left: 2.45px;
}
</style>