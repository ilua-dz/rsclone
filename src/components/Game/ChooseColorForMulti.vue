<template>
  <div class="content">
    <h3> {{ possibleCards.length > 0 ? heading.build : heading.fail }}</h3>
    <ul class="card-list">
      <li class="card"
      @click="chooseColor(card)"
      :key="card"
      v-for="card in possibleCards"
      >
        <div class="card-background" :style="{
          background: `center / contain no-repeat url(./assets/game/wagon_cards/${card}.png)`,
        }"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import Btn from '../Button/Btn.vue';
import railwayInfoInterface from '../interface/railwayInfo';
import typeOfCardsColor from '../interface/colorType';

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
    Btn,
  },
})
export default class ChooseColorForMulti extends Vue {
  @Prop({ default: 0 }) private path!: string;

  getRailwaysInfo!: railwayInfoInterface[];

  getUsers!:userInterface[];

  getCurrentName!: string;

  heading = {
    build: 'Выбор цвета для постройки маршрута',
    fail: 'Не хватает карт для постройки',
  }

  get currentWay(): railwayInfoInterface {
    return this.getRailwaysInfo.filter((route) => route.id === this.path)[0];
  }

  get trainsAmount(): number {
    return this.currentWay.trainsAmount;
  }

  get currentUser(): userInterface {
    return this.getUsers.filter((user) => user.name === this.getCurrentName)[0];
  }

  get possibleCards(): string[] {
    const playerCards = Object.entries(this.currentUser.hand.cards).map(([key, value]): string => {
      if (key !== 'loco') {
        if (value !== 0
          && (value >= this.trainsAmount
          || this.currentUser.hand.cards.loco + value >= this.trainsAmount)) {
          return key;
        }
      }
      if (value >= this.trainsAmount) {
        return key;
      }
      return '';
    }).filter((str) => str.length > 0);
    return playerCards;
  }

  chooseColor(color: typeOfCardsColor): void {
    this.$emit('close-modal');
    this.$emit('build-multi-way', color);
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2rem;
}
.card-list {
  display: flex;
  list-style: none;
  gap: 1rem;
}

.card {
  background-color: rgb(129, 129, 129);
  border: 0.1rem solid black;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: var(--card-shadow);
   &:hover {
    z-index: 5;
    transform: rotate(3deg) scale(1.05);
    box-shadow: 0 0 1rem 0.3rem white;
  }
  &:active {
    transform: rotate(-3deg) scale(1.05);
  }
  &-background {
    transform: rotate(270deg) scale(1.6);
    width: 10rem;
    height: 16.2rem;
  }
}

</style>
