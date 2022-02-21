import Vue from 'vue';
import Vuex from 'vuex';
import user from './user/user';
import railway from './railway/railway';
import game from './game/game';
import chat from './chat/chat';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    railway,
    game,
    chat,
  },
});

export default store;
