/*jslint esversion:6 */
import Vue from 'vue';
import Vuex from 'vuex';
import UserModule from './userModule';
import WebsocketModule from './websocket';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        _user_info: UserModule,
        _websocket: WebsocketModule
    }
}); export default store;
