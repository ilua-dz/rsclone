<template>
  <div class="game-field">
    <div class="background"></div>
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
        :class="[railway.status ? 'route_builded' : 'route_available']"
        :style="{
          fill: railway.status ? getUsers.find((u) => u.name === railway.status).color : '',
        }"
      />
      <City
        :key="city.id"
        v-for="city in citiesInfo"
        :city="city"
        class="city-point"
        :show="visibleCities.includes(city.name)"
      />
    </svg>
    <modal-window v-if="showBuildWayModal" @close-modalWindow="showBuildWayModal = false">
      <build-way
        :chosen-color="chosenColorForMulti"
        :path="path"
        @close-modal="showBuildWayModal = false"
      />
    </modal-window>
    <modal-window
      v-if="showChooseColorForMulti"
      @close-modalWindow="showChooseColorForMulti = false"
    >
      <choose-color-for-multi
        :path="path"
        @close-modal="showChooseColorForMulti = false"
        @build-multi-way="buildMultiWay"
      />
    </modal-window>
  </div>
</template>

<script lang="ts">
// import Prop if i will use props
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import railwayInterface from '../interface/railway';
import railwayInfoInterface from '../interface/railwayInfo';
import userInterface from '../interface/user';
import Railway from './Railway.vue';
import City from './City.vue';
import ModalWindow from '../ModalWindow/ModalWindow.vue';
import BuildWay from '../Game/BuildWay.vue';
import ChooseColorForMulti from '../Game/ChooseColorForMulti.vue';
import typeOfCardsColor from '../interface/colorType';
import taskInterface from '../interface/taskInterface';
import citiesInfo from '../../store/game/citiesInfo';

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
      'getCurrentTasks',
    ]),
  },

  components: {
    Railway,
    City,
    ModalWindow,
    BuildWay,
    ChooseColorForMulti,
  },
})
export default class Map extends Vue {
  @Prop({ default: [] }) private visibleCities!: string[];
  // get mapGetters('getRailways') ,

  getRailways!: railwayInterface[];

  getRailwaysInfo!: railwayInfoInterface[];

  getTurn!: number;

  getUsers!: userInterface[];

  getCurrentName!: string;

  getTurnWeight!: number;

  path!: string;

  showBuildWayModal = false;

  showChooseColorForMulti = false;

  getCurrentTasks!: taskInterface[];

  chosenColorForMulti: typeOfCardsColor = 'loco';

  citiesInfo = citiesInfo;

  get checkActive(): boolean {
    if (this.getTurn === -1) return false;
    return this.getUsers[this.getTurn % this.getUsers.length].name === this.getCurrentName;
  }

  pickWay(e: MouseEvent): void {
    if (this.checkActive && this.getTurnWeight === 0) {
      if (e.target instanceof Element) {
        const target = e.target.closest('.route');
        if (target) {
          this.path = target.getAttribute('data-path') || '';
          if (this.path) {
            const currentRoute = this.getRailwaysInfo.find((route) => route.id === this.path);
            if (currentRoute) {
              if (currentRoute.color !== 'multi') {
                this.showBuildWayModal = true;
              } else {
                this.showChooseColorForMulti = true;
              }
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

  buildMultiWay(color: typeOfCardsColor): void {
    this.chosenColorForMulti = color;
    this.showBuildWayModal = true;
  }
}
</script>

<style lang="scss" scoped>
.game-field {
  position: relative;
  display: flex;
  align-items: flex-start;
  border-radius: 2rem;
  border: double;
  overflow: hidden;
  box-shadow: var(--any-table-shadow);
  &__img {
    // max-width: 98vw;
    // height: min-content;
    height: 85vh;
    // max-height: 82vh;
  }
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: center / cover no-repeat url('../../assets/map/gamefield.jpg');
  filter: blur(10px);
}
// .city-point {
//   opacity: 0;
//   transition: 0.5s;
//   &.show {
//     opacity: 1;
//   }
// }
</style>
