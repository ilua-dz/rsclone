<template>
  <div class="game-field">
    <svg
      class="game-field__img"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      id="svg5"
      version="1.1"
      viewBox="0 0 2048 1380"
      @click="pickWay"
    >
      <image xlink:href="assets/map/gamefield.jpg" id="image17" />
      <Railway
        :key="railway.id"
        v-for="railway in getRailways"
        :railway="railway"
        :data-path="railway.id"
        :users="getUsers"
        :class="{'route_available': !railway.status}"
        :style="{fill: railway.status ?
          getUsers.find((u) => u.name === railway.status).color
          : ''}"
      />
    </svg>
    <modal-window v-if="showBuildWayModal"
      @close-modalWindow="showBuildWayModal = false"
    >
      <build-way
        :path="path"
        @close-modal="showBuildWayModal = false"
      />
    </modal-window>
  </div>
</template>

<script lang="ts">
// import Prop if i will use props
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import railwayInterface from '../interface/railway';
import railwayInfoInterface from '../interface/railwayInfo';
import userInterface from '../interface/user';
import Railway from './Railway.vue';
import ModalWindow from '../ModalWindow/ModalWindow.vue';
import BuildWay from '../Game/BuildWay.vue';

@Component({
  computed: {
    ...mapGetters([
      'getRailways',
      'getUsers',
      'getRailwaysInfo',
      'getUsers',
      'getTurn',
      'getTurnWeight',
      'getCurrentName',
    ]),
  },

  components: {
    Railway,
    ModalWindow,
    BuildWay,
  },
})
export default class Map extends Vue {
  // @Prop({ default: [] }) private railways!: railwayInterface[];
  // get mapGetters('getRailways') ,
  getRailways!: railwayInterface[];

  getRailwaysInfo!: railwayInfoInterface[];

  getTurn!: number;

  getUsers!:userInterface[];

  getCurrentName!: string;

  getTurnWeight!: number;

  path!: string;

  showBuildWayModal = false;

  get checkActive(): boolean {
    if (this.getTurn === -1) return false;
    return this.getUsers[this.getTurn].name === this.getCurrentName;
  }

  pickWay(e: MouseEvent):void {
    if (this.checkActive && this.getTurnWeight === 0) {
      if (e.target instanceof Element) {
        const target = e.target.closest('.route');
        if (target) {
          this.path = target.getAttribute('data-path') || '';
          if (this.path) {
            const currentRoute = this.getRailwaysInfo.find((route) => route.id === this.path);
            if (currentRoute) {
              console.log(currentRoute.color);
              console.log(currentRoute.trainsAmount);
              this.showBuildWayModal = true;
            } else {
              console.log('Error: cant find this route in base');
            }
          } else {
            console.log('Error: wrong path');
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.game-field {
  display: flex;
  align-items: flex-start;
  border-radius: 2rem;
  border: 0.2rem solid rgb(139, 89, 24);
  overflow: hidden;
  background: rgb(165, 165, 165);
  &__img {
    // max-width: 98vw;
    // height: min-content;
    height: 85vh;
    // max-height: 82vh;
  }
}
</style>
