<template>
  <div class="content">
    <h3>Постройка станции</h3>
    <h4 v-if="!routes.length">Нет доступных маршрутов для постройки</h4>
    <div v-else>
      <h4>Для постройки станции выберете маршрут который хотите использовать</h4>
      <ul class="routes-list">
        <li
        class="routes-item"
        :key="indx"
        @click="buildStation(route)"
        v-for="(route, indx) in routes">{{ route[0] }} - {{ route[1] }}</li>
      </ul>
    </div>
    <Btn :method="declineBuild" title="Отмена" :class="['btn-decline']" />
    <modal-window
      v-if="showChooseCards"
      @close-modalWindow="showChooseCards = false"
    >
      <cards-for-station
        @close-modal="showChooseCards = false"
        @build-build="buildThis"
      />
    </modal-window>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import Btn from '../Button/Btn.vue';
import railwayInterface from '../interface/railway';
import railwayInfoInterface from '../interface/railwayInfo';
import typeOfCardsColor from '../interface/colorType';
import citiesInfo from '../../store/game/citiesInfo';
import ICity from '../interface/ICity';
import citiesName from '../../store/game/citiesName';
import ModalWindow from '../ModalWindow/ModalWindow.vue';
import CardsForStation from './CardsForStation.vue';

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
    Btn,
    ModalWindow,
    CardsForStation,
  },
})

export default class BuildStation extends Vue {
  @Prop({ default: -1 }) private city!: number;

  getUsers!: userInterface[];

  getCurrentName!: string;

  getRailways!: railwayInterface[];

  getRailwaysInfo!: railwayInfoInterface[];

  citiesInfo = citiesInfo;

  chosenRoute!: string[];

  showChooseCards = false;

  get currentUser(): userInterface | undefined {
    return this.getUsers.find((u) => u.name === this.getCurrentName);
  }

  get currentCity(): ICity {
    return citiesInfo.filter((city) => city.id === this.city)[0];
  }

  get routes(): string[][] {
    const railways = this.getRailwaysInfo.filter((railway): boolean => {
      const status = this.getRailways.find((r) => r.id === railway.id)?.status;
      if (railway.cities.includes(this.currentCity.name)
      && status && status !== this.getCurrentName) return true;
      return false;
    });
    return railways
      .map((railway) => railway.cities
        .map((city) => citiesName.filter((c) => c.includes(city))[0][1]));
  }

  declineBuild(): void {
    this.$emit('close-modal');
  }

  buildStation(route: string[]): void {
    this.chosenRoute = route.map((city) => citiesName.filter((c) => c.includes(city))[0][0]);
    this.showChooseCards = true;
  }

  buildThis(cardsToPay: { color: typeOfCardsColor; value: number; loco: number }): void {
    this.$socket.emit('buildStation', this.getCurrentName, this.currentCity.id, this.chosenRoute, cardsToPay);
    this.$emit('close-modal');
  }
}

</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}
.routes-list {
  margin-top: 2rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.routes-item {
  border: 1px solid rgb(56, 56, 56);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    background-color: cornsilk;
  }
}

</style>
