import Vue from 'vue';
// import Vuex from 'vuex';
import Vuex from './fuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: 'andy',
    num: 0,
    age: 0,
  },
  getters: {
    myName(state) {
      return state.name + '666';
    },
  },
  mutations: {
    addNum(state, payload) {
      console.log(state, payload);
      state.num += payload;
    },
    addAge(state, payload) {
      state.age += payload;
    },
  },
  //异步改变共享数据
  actions: {
    asyncAddAge({ commit }, payload) {
      setTimeout(() => {
        commit('addAge', payload);
      }, 3000);
    },
  },
  modules: {},
});
