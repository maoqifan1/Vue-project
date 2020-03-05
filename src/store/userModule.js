/*jslint esversion:6 */
// 保存全局数据

import { Message } from 'element-ui';
import axios from 'axios';

const UserModule = ({
    state: {
        user_info: {}, // 用户的信息
        user_groups: [], // 用户的分组信息集合
        user_friends_info: [],// 用户的好友信息集合
        user_conversions_info: [], // 用户当前会话对象的集合
        con_friends_id: [],// 当前与用户会话的好友的id的集合
    }, mutations: {
        setUserGroupInfo(state, groups) {
            // 先清空当前集合
            state.user_groups.splice(0, state.user_groups.length);
            state.user_groups = groups;
        },
        setUserFriendsInfo(state, friends_info) {
            // 先清空当前集合
            state.friends_info.splice(0, state.friends_info.length);
            state.user_friends_info = friends_info;
        },
        setUserConversionsInfo(state, user_conversions_info) {
            // 先清空数组
            state.user_conversions_info.splice(0, state.user_conversions_info.length);
            state.user_conversions_info = user_conversions_info;
        },
        setConFriendsId(state, friends_id) {
            // 先清空当前集合
            state.con_friends_id.splice(0, state.con_friends_id.length);
            state.con_friends_id = friends_id;
        }
    }, actions: {
        // 从服务器端获得当前用户所有分组
        getCurrentUserGroupInfoFromServerAsync(context) {
            axios.get('/api' + "/user/group")
                .then((response) => {
                    let data = response.data;
                    if (data.includes("ERROR")) {
                        Message.error("请登录");
                    } else {
                        // 存放格式化后的_user_group
                        let _user_group = [];
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
                            _user_group.push({
                                id: group_id,
                                name: group_name
                            });
                        });
                        // 调用mutations中的setUserGroupInfo函数进行赋值
                        context.commit('setUserGroupInfo', _user_group);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 从服务器端获得当前用户的所有好友信息
        getCurrentUserFriendsInfoFromServerAsync(context) {
            axios.get(this.HOME + "/friends")
                .then(res => {
                    // 获得响应的数据部分
                    let data = res.data;
                    // 当数据集为空时不提示
                    if (data.includes("EMPTY_LIST")) {
                        console.log("当前用户无好友");
                    } else {
                        // 创建数组保存格式化后的好友对象
                        let _friend_list = [];
                        // 格式化数据对象
                        let friend_list = JSON.parse(data);
                        friend_list.map(friend => {
                            // 将数据加入到保存用户好友数据的数组中
                            _friend_list.push({
                                friend_id: friend.fId, // 好友id
                                friend_name: friend.fName, // 好友名称
                                friend_icon: friend.fIcon, // 好友的头像
                                friend_remark: friend.fRemark, // 好友的备注
                                friend_group_id: friend.uGpId, // 好友所在分组的id
                                friend_group_name: friend.uGpName // 好友所在分组的名称
                            });
                        });
                        // 调用mutations中的setUserFriendsInfo函数进行赋值
                        context.commit('setUserFriendsInfo', _friend_list);
                    }
                }).catch(err => {
                    Message.error("获得好友信息出错");
                });
        },
        //从服务器获取当前用户所有的会话信息并加入到本地对象中
        getCurrentUserConversionInfoFromServerAsync(context) {
            // 调用axios发起get请求
            axios.get(this.HOME + "/cons")
                .then(function (result) {
                    // 获取响应的数据部分
                    let data = result.data;
                    // 如果为空集合,则输出到控制台
                    if (data.includes("EMPTY_LIST")) {
                        console.log("当前用户还没有创建会话");
                    } else {
                        // 保存格式化后的用户会话对象
                        let _user_cons = [];
                        // 保存当前与用户会话的好友的id
                        let _con_friends_id = [];
                        // 格式化数据部分
                        let user_cons = JSON.parse(data);
                        // 将会话对象保存到本地会话对象数组中
                        user_cons.map(con => {
                            _user_cons.push({
                                f_id: con.friUId,   // 会话的好友的id
                                u_con_state: con.curUState, // 当前用户的会话窗口的状态
                                f_con_state: con.friUState, // 好友的会话窗口的状态
                            });
                            // 会话的好友的id
                            _con_friends_id.push(con.friUId);
                            //
                        });
                        // 调用mutations中的setUserConversions函数 和 setConFriendsId进行赋值
                        context.commit('setUserConversions', _user_cons);
                        context.commit('setConFriendsId', _con_friends_id);

                    }
                }.bind(this))
                .catch(err => {
                    Message.error("获取会话失败，请刷新后重试");
                });
        },
    } // actions结束
});
export default UserModule;