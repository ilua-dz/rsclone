<template>
  <div id="app">
    <Lobby
      :users="getUsers"
      @add-new-user="addUser"
      @toggle-status="toggleStatus"
      @set-new-color="setColor"
      v-show="!getGameStatus"
    />
    <Map v-show="getGameStatus" />
    <modal-window v-if="getGameStatus && !getTurn" :timer="6" ></modal-window>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Lobby from './components/Lobby.vue';
import Map from './components/Map/Map.vue';
import ModalWindow from './components/ModalWindow/ModalWindow.vue';

// import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    Lobby,
    Map,
    ModalWindow,
    // HelloWorld,
  },

  computed: { ...mapGetters(['getUsers', 'getColors', 'getRailways', 'getGameStatus', 'getTurn']) },

  methods: {
    addUser(name: string, usedColors: string[]) {
      const user = {
        name,
        ready: false,
      };
      this.$socket.emit('setUsers', user, usedColors);
    },
    toggleStatus(name: string) {
      this.$socket.emit('changeStatus', name);
    },
    setColor(name: string, color: string) {
      this.$socket.emit('setNewColor', {
        name,
        color,
      });
    },
  },

  watch: {
    /*
    getGameStatus() {
      if (this.getGameStatus) {
        console.log('game started...');
        this.$socket.emit('weReady');
      }
    }, */
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import './style/base/base';
@import './style/base/normalize';

body {
  width: 100vw;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 2rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
