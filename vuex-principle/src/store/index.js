import Vue from 'vue';
// import Vuex from 'vuex';
import Vuex from './fuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: 'andy',
    num: 0,
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
  },
  actions: {},
  modules: {},
});
