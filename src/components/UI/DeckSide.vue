<template>
  <aside class="deck-side">
    <div class="deck deck-route">
      <div class="deck-back"></div>
      <div class="deck-action" v-if="checkActive && getRouteDeck.length" @click="pickRoute">
        Выбрать маршруты
      </div>
      <div class="deck-length">{{ getRouteDeck.length }}</div>
    </div>
    <ul class="table-card">
      <li
        :key="card"
        v-for="card in getCardTable"
        class="deck"
        :style="{
          background:
            'center / contain no-repeat url(/assets/game/wagon_cards/' +
            card.split('-')[0] +
            '.avif)',
        }"
      >
        <!-- {{ card }} -->
      </li>
    </ul>
    <div class="deck deck-card">
      <div class="deck-back"></div>
      <div class="deck-action" v-if="checkActive">Взять карту</div>
      <div class="deck-length">{{ getCardDeck.length }}</div>
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

@Component({
  computed: {
    ...mapGetters([
      'getUsers',
      'getTurn',
      'getRouteDeck',
      'getCardDeck',
      'getCardTable',
      'getCurrentName',
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

  getUsers!: userInterface[];

  getCurrentName!: string;

  showRoutesModal = false;

  modalTimer = 10;

  routesToChoose: number[] = [];

  get checkActive(): boolean {
    if (this.getTurn === -1) return false;
    return this.getUsers[this.getTurn].name === this.getCurrentName;
  }

  pickRoute(): void {
    if (this.getRouteDeck.length > 0) {
      this.routesToChoose.push(...this.getRouteDeck.splice(-3));
      this.showRoutesModal = true;
    }
    // TODO: socket emit split routes deck
    // TODO: routes to choose ->> shortRoutes in hand (in Prepare)
  }

  discardRoute(array: Array<number>): void {
    this.routesToChoose.splice(0);
    array.forEach((route) => {
      this.$socket.emit('discardShortRoute', this.getCurrentName, route);
    });
    this.$socket.emit('endOfTurn');
  }
}
</script>

<style lang="scss" scoped>
.deck-side {
  width: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 1.5rem;
}
.deck {
  width: 16.2rem;
  height: 10rem;
  border-radius: 1rem;
  border: 0.1rem solid #0e2e3a;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: 0.3s;

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
    background: #0e2e3a5b;
    width: 80%;
    height: 100%;
    transform: translateY(100%);
    z-index: 1;
    transition: all 0.3s;
  }
  &-length {
    position: absolute;
    top: 0;
    right: 0;
    background: #0e2e3a5b;
    width: 20%;
    height: 100%;
    transform: translateY(100%);
    z-index: 1;
    transition: all 0.3s;
  }

  &:hover .deck-action,
  &:hover .deck-length {
    transform: translateY(0);
  }

  &:hover {
    z-index: 5;
    transform: rotate(-5deg) scale(1.05);
    box-shadow: 0 0 1rem 0.3rem white;
  }
  &:active {
    transform: rotate(5deg) scale(1.05);
  }
}

.deck-route {
  .deck-back {
    background-image: url('/assets/game/route_cards/route-shirt.avif');
  }
}

.deck-card {
  .deck-back {
    background-image: url('/assets/game/wagon_cards/wagon-shirt.avif');
  }
}

.table-card {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.3rem;
}
</style>
