<template>
  <div class="game-field">
    <div class="background"></div>
    <p class="attention"
    v-if="checkActive"
    :class="{lastTurn: checkLastTurn}"
    >Ваш {{checkLastTurn ? 'последний ' : ''}}ход</p>
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
        :isUserActive="checkActive"
        :class="[railway.status ? 'route_builded' : 'route_available']"
        :style="{
          fill: railway.status ? getUsers.find((u) => u.name === railway.status).color : '',
        }"
      />
      <City
        :key="city.id"
        v-for="city in getCities"
        :data-city="city.id"
        :city="city"
        :isUserActive="checkActive"
        :class="[city.status ? 'station_builded' : 'station_available']"
        :style="{ fill: city.status ? getUsers.find((u) => u.name === city.status).color : '' }"
        :show="visibleCities.includes(city.name)"
      />
    </svg>
    <p>{{getCities.length}}</p>
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
    <modal-window
      v-if="showStationChooseRoute"
      @close-modalWindow="showStationChooseRoute = false"
      :sideModal="true"
    >
      <build-station
        :city="city"
        @close-modal="showStationChooseRoute = false"
      />
    </modal-window>
    <modal-window
      v-if="showDenyStations"
      @close-modalWindow="showDenyStations = false"
    >
      <deny-station
        @close-modal="showDenyStations = false"
      />
    </modal-window>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import railwayInterface from '../interface/railway';
import railwayInfoInterface from '../interface/railwayInfo';
import userInterface from '../interface/user';
import Railway from './Railway.vue';
import City from './City.vue';
import ModalWindow from '../ModalWindow/ModalWindow.vue';
import BuildWay from '../Game/BuildWay.vue';
import ChooseColorForMulti from '../Game/ChooseColorForMulti.vue';
import BuildStation from '../Game/BuildStation.vue';
import DenyStation from '../Game/DenyStation.vue';
import typeOfCardsColor from '../interface/colorType';
import taskInterface from '../interface/taskInterface';
// import citiesInfo from '../../store/game/citiesInfo';
import ICity from '../interface/ICity';

@Component({
  computed: {
    ...mapGetters([
      'getRailways',
      'getUsers',
      'getRailwaysInfo',
      'getUsers',
      'getTurn',
      'getTurnWeight',
      'getTurnToEnd',
      'getCurrentName',
      'getCurrentTasks',
      'getCities',
    ]),
  },

  components: {
    Railway,
    City,
    ModalWindow,
    BuildWay,
    BuildStation,
    DenyStation,
    ChooseColorForMulti,
  },
})
export default class Map extends Vue {
  @Prop({ default: [] }) private visibleCities!: string[];

  getRailways!: railwayInterface[];

  getRailwaysInfo!: railwayInfoInterface[];

  getCities!: ICity[];

  getTurn!: number;

  getTurnToEnd!: number;

  getUsers!: userInterface[];

  getCurrentName!: string;

  getTurnWeight!: number;

  path!: string;

  city!: number;

  showBuildWayModal = false;

  showChooseColorForMulti = false;

  showStationChooseRoute = false;

  showDenyStations = false;

  getCurrentTasks!: taskInterface[];

  chosenColorForMulti: typeOfCardsColor = 'loco';

  // citiesInfo = citiesInfo;

  get checkLastTurn(): boolean {
    return this.getTurnToEnd - this.getTurn < this.getUsers.length;
  }

  get currentUser(): userInterface | undefined {
    return this.getUsers.find((u) => u.name === this.getCurrentName);
  }

  get checkActive(): boolean {
    if (this.getTurn === -1) return false;
    return this.getUsers[this.getTurn % this.getUsers.length].name === this.getCurrentName;
  }

  pickWay(e: MouseEvent): void {
    if (this.checkActive && this.getTurnWeight === 0) {
      if (e.target instanceof Element) {
        const target = e.target.closest('.route') || e.target.closest('.city-point');
        if (target) {
          if (target.classList.contains('route')) {
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
          } else {
            this.city = Number(target.getAttribute('data-city')) || -1;
            if (this.city) {
              const currentCity = this.getCities.find((city) => city.id === this.city);
              if (this.currentUser?.hand.stations === 0) {
                this.showDenyStations = true;
              } else if (currentCity) {
                this.showStationChooseRoute = true;
              }
            }
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
  width: 100%;
  box-shadow: var(--any-table-shadow);
  &__img {
    width: 100%;
    height: 85vh;
    border-radius: inherit;
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
.attention {
  position: absolute;
  bottom: 2rem;
  left: -14rem;
  font-size: 3rem;
  color: red;
  text-shadow: 0 0 3px red;
  animation: hide 0.6s ease-in-out alternate infinite;
  &.lastTurn {
    transform: translateX(-15rem);
  }
}
@keyframes hide {
  from {
    opacity: 0;
  }
}
</style>
