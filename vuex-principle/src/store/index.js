import Vue from 'vue';
// import Vuex from 'vuex';
import Vuex from './fuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: 'andy',
    age: 23,
  },
  getters: {
    myName(state) {
      return state.name + '666';
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
