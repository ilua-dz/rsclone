<template>
  <div id="app">
    <Lobby
      :users="getUsers"
      @add-new-user="addUser"
      @toggle-status="toggleStatus"
      @set-new-color="setColor"
      v-show="!getGameStatus"
    />
    <div v-if="getGameStatus && checkUserInPlayerList" class="game">
      <div class="game-main">
        <user-side />
        <Map />
        <deck-side />
      </div>
      <player-side />
    </div>
    <div
    v-if="getGameStatus && !checkUserInPlayerList"
    class="game-already-start">
      К сожалению игра уже началась. Ждите завершения.
    </div>
    <modal-window
      v-if="showModal && checkUserInPlayerList && getGameStatus && !currentUser.preTurn"
      :timer="prepareTimer"
      @close-modalWindow="showModal = false"
    >
      <prepare
        :timer="prepareTimer"
        @get-discarded="discardRoute"
        @close-modal="prepareTimer = 0.1"
      />
    </modal-window>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Lobby from './components/Lobby.vue';
import Map from './components/Map/Map.vue';
import ModalWindow from './components/ModalWindow/ModalWindow.vue';
import Prepare from './components/Game/Prepare.vue';
import UserSide from './components/UI/UserSide.vue';
import DeckSide from './components/UI/DeckSide.vue';
import PlayerSide from './components/UI/PlayerSide.vue';
import Storage from './components/localStorage/storage';
import userInterface from './components/interface/user';
import taskInterface from './components/interface/taskInterface';

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

  methods: {},

  watch: {},
})
export default class App extends Vue {
  getCurrentName!: string;

  getTurn!: number;

  prepareTimer = 30;

  showModal = true;

  getUsers!: userInterface[];

  storage = new Storage();

  @Watch('getTurn') onTurnChange(): void {
    if (this.getTurn === -1) this.prepareTimer = 30;
  }

  get currentUser(): userInterface {
    return this.getUsers.filter((user) => user.name === this.getCurrentName)[0];
  }

  get checkUserInPlayerList(): boolean {
    return this.getUsers.includes(this.currentUser);
  }

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

  discardRoute(array: taskInterface[]): void {
    array.forEach((route) => {
      // if (route === 'long') this.$socket.emit('discardLongRoute', this.getCurrentName);
      this.$socket.emit('discardRoute', this.getCurrentName, route);
    });
    this.$socket.emit('userPrepared', this.getCurrentName);
  }
}
</script>

<style lang="scss">
@import './style/base/base';
@import './style/base/normalize';
@import './style/base/_typography.scss';

body {
  // width: 100vw;
  height: 100vh;
  padding: 0.2rem;
  background: #8f8f8f;
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
  gap: 0.5rem;
}
</style>
