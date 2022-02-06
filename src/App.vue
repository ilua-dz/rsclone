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
    <modal-window v-if="getGameStatus && !getTurn" :timer="25" >
      <prepare  @discard-route="discardRoute" />
    </modal-window>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Lobby from './components/Lobby.vue';
import Map from './components/Map/Map.vue';
import ModalWindow from './components/ModalWindow/ModalWindow.vue';
import Prepare from './components/Game/Prepare.vue';

@Component({
  components: {
    Lobby,
    Map,
    ModalWindow,
    Prepare,
    // HelloWorld,
  },

  computed: {
    ...mapGetters([
      'getUsers',
      'getColors',
      'getRailways',
      'getGameStatus',
      'getTurn',
    ]),

    /* nice try

    currentUser: function getCurrentUser(): userInterface {
      const storage = new Storage();
      const { name } = storage.data;
      const usersList: userInterface[] = this.$store.state.user.users;
      return usersList.filter((user) => user.name === name)[0];
    },

    longRoute: function getLongRoute(): number | undefined {
      const user: userInterface = this.currentUser;
      return user.hand.longRoute;
    },

    shortRoute: function getShortRoute(): number[] | undefined {
      const user: userInterface = this.currentUser;
      return user.hand.shortRoute;
    },

    cards: function getCards() {
      const user: userInterface = this.currentUser;
      return user.hand.cards;
    },

    */

  },

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
    discardRoute(array: Array<string|number>) {
      array.forEach((route) => {
        if (route === 'long') this.$socket.emit('discardLongRoute');
        else this.$socket.emit('discardShortRoute', route);
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
