<template>
  <aside class="deck-side">
    <div class="deck-route">
      <h4 class="deck-title">Колода маршрутов</h4>

      <div class="deck" :class="{ active: checkActive }">
        <div class="deck-back"></div>
        <div
          class="deck-action"
          v-if="checkActive && getRouteDeck.length && getTurnWeight === 0"
          @click="pickRoute"
        ></div>
      </div>
      <div class="deck-length">
        <div
          class="left-of"
          :style="{ height: Math.floor((getRouteDeck.length / 40) * 100) + '%' }"
        ></div>
      </div>
    </div>
    <ul class="table-card">
      <li
        :key="index"
        v-for="(card, index) in getCardTable"
        class="deck"
        :class="{ active: checkActive }"
        :data-color="card"
        :data-index="index"
        :style="{
          background: `center / contain no-repeat url(./assets/game/wagon_cards/${card}.png)`,
        }"
      >
        <div class="deck-back"></div>
        <div
          class="deck-action"
          v-if="checkActive && (card !== 'loco' || (card === 'loco' && getTurnWeight === 0))"
          @click="pickCardTable"
        ></div>
      </li>
    </ul>
    <div class="deck-card">
      <h4 class="deck-title">Колода вагонов</h4>

      <div class="deck" :class="{ active: checkActive }">
        <div class="deck-back"></div>
        <div
          class="deck-action"
          v-if="checkActive && getCardDeck.length > 0 && getTurnWeight < 2"
          @click="pickCardDeck"
        ></div>
      </div>
      <div class="deck-length">
        <div
          class="left-of"
          :style="{ height: Math.floor((getCardDeck.length / 110) * 100) + '%' }"
        ></div>
      </div>
    </div>
    <modal-window v-if="showRoutesModal" :timer="modalTimer">
      <Prepare
        :picked-routes="routesToChoose"
        :timer="modalTimer"
        @get-discarded="discardRoute"
        @close-modal="showRoutesModal = false"
      />
    </modal-window>
  </aside>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import ModalWindow from '../ModalWindow/ModalWindow.vue';
import Prepare from '../Game/Prepare.vue';
import playSound from '../../utils/sounds/index';
import taskInterface from '../interface/taskInterface';

@Component({
  computed: {
    ...mapGetters([
      'getUsers',
      'getTurn',
      'getRouteDeck',
      'getCardDeck',
      'getCardTable',
      'getCurrentName',
      'getTurnWeight',
    ]),
  },
  components: {
    ModalWindow,
    Prepare,
  },
})
export default class DeckSide extends Vue {
  getCardTable!: string[];

  getRouteDeck!: number[];

  getCardDeck!: number[];

  getTurn!: number;

  getTurnWeight!: number;

  getUsers!: userInterface[];

  getCurrentName!: string;

  showRoutesModal = false;

  modalTimer = 10;

  routesToChoose: number[] = [];

  timerForWait = 200;

  userReady = true;

  setTimerForUser(): void {
    this.userReady = false;
    setTimeout(() => {
      this.userReady = true;
    }, this.timerForWait);
  }

  get checkActive(): boolean {
    if (this.getTurn === -1) return false;
    return this.getUsers[this.getTurn % this.getUsers.length].name === this.getCurrentName
    && this.userReady;
  }

  pickRoute(): void {
    playSound('takeRouteCards');
    if (this.getRouteDeck.length > 0) {
      this.routesToChoose.push(...this.getRouteDeck.splice(-3));
      console.log('pickRoute');
      this.showRoutesModal = true;
    }
    // TODO: socket emit split routes deck
    // TODO: routes to choose ->> shortRoutes in hand (in Prepare)
  }

  discardRoute(array: taskInterface[]): void {
    this.routesToChoose.splice(0);
    array.forEach((route) => {
      this.$socket.emit('discardRoute', this.getCurrentName, route);
    });
    this.setTimerForUser();
    setTimeout(() => {
      this.$socket.emit('endOfTurn');
    }, this.timerForWait);
  }

  pickCardTable(e: MouseEvent): void {
    playSound('takeCard');
    if (e.target instanceof Element) {
      const target = e.target.closest('.deck') || e.target;
      const color = target.getAttribute('data-color');
      if ((color === 'loco' && this.getTurnWeight === 0) || color !== 'loco') {
        const cardIndex = Number(target.getAttribute('data-index'));
        this.$socket.emit('pickCardTable', this.getCurrentName, cardIndex, color);
        this.setTimerForUser();
        if (color === 'loco' || this.getTurnWeight > 0) {
          this.$socket.emit('endOfTurn');
        }
      }
    }
  }

  pickCardDeck(): void {
    playSound('takeCard');
    this.$socket.emit('pickCardDeck', this.getCurrentName);
    this.setTimerForUser();
    if (this.getTurnWeight > 0) {
      this.$socket.emit('endOfTurn');
    }
  }
}
</script>

<style lang="scss" scoped>
.deck-side {
  padding: 1rem 3rem 1rem 3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: double;
  border-radius: 2.5rem;
  box-shadow: var(--any-table-shadow);
  background: rgb(212, 212, 212);
}
.deck {
  width: 16.2rem;
  height: 10rem;
  border-radius: 1rem;
  border: 0.1rem solid #0e2e3a;
  text-align: center;
  overflow: hidden;
  position: relative;
  transition: 0.3s;
  box-shadow: 3px -4px 5px 2px rgba(0, 0, 0, 0.5);

  &-back {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 0;
    background: center / contain no-repeat;
  }
  &-action {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    cursor: pointer;
  }
  &-length {
    background: black;
    width: 2rem;
    display: flex;
    align-items: end;
    border-radius: 2.5rem;
    border-style: inset;
    border-color: black;
    transition: all 0.3s;
    box-shadow: 3px -4px 5px 2px rgba(0, 0, 0, 0.5);

    .left-of {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: rgb(251, 255, 0);
    }
  }
  &-title {
    text-align: center;
    writing-mode: vertical-rl;
    height: 10rem;
    transform: rotate(180deg);
    text-shadow: 0 0 0px black, 0 0 0px black, 0 0 10px white;
  }
  &.active:hover {
    z-index: 5;
    transform: rotate(-3deg) scale(1.05);
    box-shadow: 0 0 1rem 0.3rem white;
  }
  &.active:active {
    transform: rotate(3deg) scale(1.05);
  }
}

.deck-route {
  display: flex;
  gap: 2rem;
  .deck-back {
    background-image: url('../../assets/game/route_cards/route-shirt.png');
  }
}

.deck-card {
  display: flex;
  gap: 2rem;
  .deck-back {
    background-image: url('../../assets/game/wagon_cards/wagon-shirt.png');
  }
}

.table-card {
  list-style: none;
  width: 95%;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.3rem;
  border: groove;
  border-radius: 2.5rem;
  background: rgba($color: #000000, $alpha: 0.4);
  box-shadow: var(--any-table-shadow);
}
</style>
