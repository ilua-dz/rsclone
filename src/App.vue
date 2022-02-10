<template>
  <div id="app">
    <Lobby
      :users="getUsers"
      @add-new-user="addUser"
      @toggle-status="toggleStatus"
      @set-new-color="setColor"
      v-show="!getGameStatus"
    />
    <div v-show="getGameStatus" class="game">
      <div class="game-main">
        <user-side  />
        <Map  />
        <deck-side  />
      </div>
      <player-side  />
    </div>
    <modal-window v-if="getGameStatus && getTurn === -1" :timer="prepareTimer" >
      <prepare
      :timer="prepareTimer"
      @get-discarded="discardRoute"
      @close-modal="prepareTimer = 0.1"/>
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
import UserSide from './components/UI/UserSide.vue';
import DeckSide from './components/UI/DeckSide.vue';
import PlayerSide from './components/UI/PlayerSide.vue';
import Storage from './components/localStorage/storage';

@Component({
  components: {
    Lobby,
    Map,
    ModalWindow,
    Prepare,
    UserSide,
    DeckSide,
    PlayerSide,
    // HelloWorld,
  },

  computed: {
    ...mapGetters([
      'getUsers',
      'getColors',
      'getRailways',
      'getGameStatus',
      'getTurn',
      'getCurrentName',
    ]),
  },

  methods: {
  },

  watch: {

  },
})
export default class App extends Vue {
  getCurrentName!: string;

  prepareTimer = 25;

  storage = new Storage();

  created(): void {
    if (this.storage.data.name) this.$store.commit('setCurrentName', this.storage.data.name);
    if (this.storage.data.color) this.$store.commit('setCurrentColor', this.storage.data.color);
  }

  addUser(name: string, usedColors: string[]): void {
    const user = {
      name,
      ready: false,
    };
    this.$store.commit('setCurrentName', name);
    this.$socket.emit('setUsers', user, usedColors);
  }

  toggleStatus(name: string): void {
    this.$socket.emit('changeStatus', name);
  }

  setColor(name: string, color: string): void {
    this.$socket.emit('setNewColor', {
      name,
      color,
    });
  }

  discardRoute(array: Array<string|number>):void {
    array.forEach((route) => {
      if (route === 'long') this.$socket.emit('discardLongRoute', this.getCurrentName);
      else this.$socket.emit('discardShortRoute', this.getCurrentName, route);
    });
    this.$socket.emit('userPrepared');
  }
}

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

.game-main {
  display: flex;
}

</style>
