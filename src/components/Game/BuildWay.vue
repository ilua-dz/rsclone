<template>
  <div class="content">
    <h3>Постройка маршрута</h3>
    <p> {{ message }} </p>
    <Btn
      title="Построить"
      :class="[
        'btn-accept' ,
      ]"
    />
    <Btn
      title="Отмена"
      :class="[
        'btn-decline',
      ]"
    />
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
export default class BuildWay extends Vue {
  @Prop({ default: 0 }) private path!: string;

  getRailwaysInfo!: railwayInfoInterface[];

  getUsers!:userInterface[];

  getCurrentName!: string;

  message = '';

  get currentWay(): railwayInfoInterface {
    return this.getRailwaysInfo.filter((route) => route.id === this.path)[0];
  }

  get trainColor(): typeOfCardsColor | 'multi' {
    return this.currentWay.color;
  }

  get trainsAmount(): number {
    return this.currentWay.trainsAmount;
  }

  get currentUser(): userInterface {
    return this.getUsers.filter((user) => user.name === this.getCurrentName)[0];
  }

  mounted(): void {
    if (this.trainColor !== 'multi') {
      const playerHas = this.currentUser.hand.cards[this.trainColor];
      const playerLoco = this.currentUser.hand.cards.loco;
      console.log(this.message);
      if (playerHas >= this.trainsAmount) {
        this.message = `У вас ${playerHas} вагонов нужного цвета. Построить путь, потратив ${this.trainsAmount}?`;
      } else if (playerHas + playerLoco >= this.trainsAmount) {
        this.message = `У вас ${playerHas} вагонов нужного цвета. Построить путь, потратив их и ${this.trainsAmount - playerHas} локомотив?`;
      } else {
        this.message = 'У вас не хватает вагонов для постройки маршрута';
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.route-list{
  display: flex;
  width: 100%;
  justify-content: space-between;
  list-style: none;
}

.route{
  font-size: 1.6rem;
  width: 22%;
  background-color: rgb(129, 129, 129);
  cursor: pointer;
  transition: all 0.3s;

  &__long{
    background-color: rgb(91, 144, 204);
  }

  &.discard{
    filter: blur(.3rem);
  }
}

.btn-prepare{
  margin: 1rem auto;
}

</style>
