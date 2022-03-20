<template>
  <div id="app">
    <Lobby
      v-cloak
      :users="getUsers"
      @add-new-user="addUser"
      @toggle-status="toggleStatus"
      @set-new-color="setColor"
      v-show="!getGameStatus && getTurn !== -2"
    />
    <div v-if="getGameStatus" class="game" v-cloak>
      <div class="game-main">
        <user-side />
        <Map :visibleCities="visibleCities" />
        <deck-side
        @showCities="showCities"
        @hideCities="hideCities"/>
      </div>
      <player-side v-if="checkUserInPlayerList"
      @showCities="showCities"
      @hideCities="hideCities" />
    </div>
    <div v-if="getGameStatus && !checkUserInPlayerList" class="game-already-start" v-cloak>
      К сожалению игра уже началась. Ждите завершения.
    </div>
    <modal-window
      v-if="showModal && checkUserInPlayerList && getGameStatus && !currentUser.preTurn"
      :sideModal="true"
      :timer="prepareTimer"
      @close-modalWindow="showModal = false"
    >
      <prepare
        :timer="prepareTimer"
        @get-discarded="discardRoute"
        @close-modal="prepareTimer = 0.1"
        @showCities="showCities"
        @hideCities="hideCities"
      />
    </modal-window>
    <div class="preloader" v-show="getTurn < -1"></div>
    <chat v-if="getTurn !== -2" v-cloak/>
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
import Chat from './components/chat/Chat.vue';
import Storage from './components/localStorage/storage';
import userInterface from './components/interface/user';
import taskInterface from './components/interface/taskInterface';
import playSound from './utils/sounds';

@Component({
  components: {
    Lobby,
    Map,
    ModalWindow,
    Prepare,
    UserSide,
    DeckSide,
    PlayerSide,
    Chat,
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

  getGameStatus!: boolean;

  prepareTimer = 180;

  showModal = true;

  getUsers!: userInterface[];

  storage = new Storage();

  visibleCities: string[] = [];

  @Watch('getTurn') onTurnChange(): void {
    if (this.getTurn === -1) {
      this.prepareTimer = 180;
      this.showModal = true;
    }
    playSound('gameTurn');
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
    this.$socket.emit('setId', this.storage.data.name);
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

  showCities(cities: string[]): void {
    this.visibleCities = cities;
  }

  hideCities(): void {
    this.visibleCities = [];
  }
}
</script>

<style lang="scss">
@import './style/base/base';
@import './style/base/normalize';
@import './style/base/_typography.scss';

body {
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
  overflow: hidden;
}

.game-main {
  display: flex;
  gap: 0.5rem;
}

[v-cloak] {
  display: none;
}

.preloader {
  background-image: url('./assets/preloader_cut.gif');
  background-color: #ffd5d3;
  background-size: unset;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: 100%;
}
.game-already-start {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ffd5d381;
  text-align: center;
  font-size: 4rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 80;
}
</style>
