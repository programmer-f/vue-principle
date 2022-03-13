import Vue from 'vue';
// import Vuex from 'vuex';
import Vuex from './fuex';

Vue.use(Vuex);
//login模块
const login = {
  state: {
    loginName: 'com',
  },
  getters: {
    getLoginName(state) {
      return state.loginName + 'get';
    },
  },
  mutations: {
    changeLoginName(state, payload) {
      state.loginName += payload;
    },
  },
  actions: {
    asyncChangeLoginName({ commit }, payload) {
      setTimeout(() => {
        commit('changeLoginName', payload);
      }, 3000);
    },
  },
};
//home模块
const home = {
  state: {
    homeName: 'www',
  },
  getters: {
    getHomeName(state) {
      return state.homeName + 'get';
    },
  },
  mutations: {
    changeHomeName(state, payload) {
      state.homeName += payload;
    },
  },
  actions: {
    asyncChangeHomeName({ commit }, payload) {
      setTimeout(() => {
        commit('changeHomeName', payload);
      }, 3000);
    },
  },
};
//account模块
const account = {
  state: {
    accountName: 'it666',
  },
  getters: {
    getAccountName(state) {
      return state.accountName + 'get';
    },
  },
  mutations: {
    changeAccountName(state, payload) {
      state.accountName += payload;
    },
  },
  actions: {
    asyncChangeAccountName({ commit }, payload) {
      setTimeout(() => {
        commit('changeAccountName', payload);
      }, 3000);
    },
  },
  modules: {
    login: login,
  },
};

export default new Vuex.Store({
  state: {
    globalName: 'andy',
  },
  getters: {
    getGlobalName(state) {
      return state.globalName + 'get';
    },
  },
  mutations: {
    changeGlobalName(state, payload) {
      console.log('全局的changeGlobalName');
      state.globalName += payload;
    },
  },
  //异步改变共享数据
  actions: {
    asyncChangeGlobalName({ commit }, payload) {
      setTimeout(() => {
        commit('changeGlobalName', payload);
      }, 3000);
    },
  },
  //模块化共享数据
  modules: {
    home: home,
    account: account,
  },
});
