/*jslint esversion:6 */

let websock = null;
let global_callback = null;
// 映射路径
let HOME = '/api';
// 映射websocket通信路径
let SOCKET_HOME = "ws://localhost:8083";

function initWebSocket() { //初始化weosocket
    if ("WebSocket" in window) {
        // 建立连接
        websock = new WebSocket(SOCKET_HOME + "/chat");
    } else {
        console.log("sockjs");
        // 使用sockjs建立连接
        this.websock = new SockJS(HOME + "/sockjs/chat");
    }
    // 当获得消息时
    websock.onmessage = function (e) {
        websocketonmessage(e);
    };
    // 当关闭连接时
    websock.onclose = function (e) {
        websocketclose(e);
    };
    // 当打开连接时
    websock.onopen = function () {
        websocketOpen();
    };

    //连接发生错误的回调方法
    websock.onerror = function () {
        console.log("WebSocket连接发生错误");
    };
}

// 实际调用的方法
function sendSock(agentData, callback) {
    global_callback = callback;
    if (websock.readyState === websock.OPEN) {
        //若是ws开启状态
        websocketsend(agentData);
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback);
        }, 1000);
    }
}

//数据接收
function websocketonmessage(e) {
    global_callback(JSON.parse(e.data));
}

//数据发送
function websocketsend(agentData) {
    websock.send(JSON.stringify(agentData));
}

//关闭
function websocketclose(e) {
    console.log("connection closed (" + e.code + ")");
}

function websocketOpen(e) {
    console.log("连接成功");
}

initWebSocket();

export { sendSock };