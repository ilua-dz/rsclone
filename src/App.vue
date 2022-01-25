<template>
  <div id="app">
    <Lobby
      :users="getUsers"
      @add-new-user="addUser"
      @toggle-status="toggleStatus"
      @set-new-color="setColor"
    />
    <Map />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Lobby from './components/Lobby.vue';
import Map from './components/Map/Map.vue';

// import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    Lobby,
    Map,
    // HelloWorld,
  },

  computed: { ...mapGetters(['getUsers', 'getColors', 'getRailways']) },

  methods: {
    addUser(name: string, usedColors: string[]) {
      const user = {
        name,
        ready: false,
      };
      this.$socket.emit('setUsers', user, usedColors);
    },
    toggleStatus(name) {
      this.$socket.emit('changeStatus', name);
    },
    setColor(name, color) {
      this.$socket.emit('setNewColor', {
        name,
        color,
      });
    },
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
