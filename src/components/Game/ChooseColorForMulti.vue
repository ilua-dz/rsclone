<template>
  <div class="content">
    <h3>Выбор цвета для постройки маршрута</h3>
    <ul class="card-list">
      <li class="card"
      @click="chooseColor(card)"
      :key="card"
      v-for="card in possibleCards">
        {{ card }}
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

  get currentWay(): railwayInfoInterface {
    return this.getRailwaysInfo.filter((route) => route.id === this.path)[0];
  }

  // get trainColor(): typeOfCardsColor | 'multi' {
  //   return this.currentWay.color;
  // }

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
.card-list {
  display: flex;
  width: 100%;
  justify-content: space-between;
  list-style: none;
}

.card {
  font-size: 1.6rem;
  width: 22%;
  background-color: rgb(129, 129, 129);
  cursor: pointer;
  transition: all 0.3s;
}
</style>
