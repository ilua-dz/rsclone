import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO('https://sleepy-eyrie-63882.herokuapp.com/'),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
    // options: { path: "/my-app/" }, //Optional options
  }),
);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
