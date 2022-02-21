import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import App from './App.vue';
import store from './store/index';

Vue.config.productionTip = false;

const URL = {
  heroku: 'https://sleepy-eyrie-63882.herokuapp.com/',
  local: 'http://localhost:3000/',
};

Vue.use(
  new VueSocketIO({
    // debug: true,
    connection: SocketIO(URL.heroku),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  }),
);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
