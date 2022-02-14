<template>
  <div class="game-player" :style="{ '--user-color': currentColor }">
    <ul class="player-box player-route">
      <li class="route route__long player-box__item" v-if="longRoute != -1">
        <div
          class="card"
          :style="{
            background:
              'center / contain no-repeat url(/assets/game/route_cards/' +
              (+longRoute + 41) +
              '.avif)',
          }"
        ></div>
      </li>
      <li
        class="route player-box__item"
        :key="route"
        v-for="route in shortRoute"
        :data-route="route"
      >
        <div
          class="card"
          :style="{
            background:
              'center / contain no-repeat url(/assets/game/route_cards/' + (+route + 1) + '.avif)',
          }"
        ></div>
      </li>
    </ul>
    <ul class="player-box player-card">
      <li class="player-box__item" :key="card[0]" v-for="card in cardsInHand">
        <div
          class="card"
          :style="{
            background:
              'center / contain no-repeat url(/assets/game/wagon_cards/' + card[0] + '.avif)',
          }"
        ></div>
        <div class="card-value">
          {{ card[1] }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';

@Component({
  computed: {
    ...mapGetters(['getUsers', 'getCurrentName']),
  },
  components: {},
})
export default class PlayerSide extends Vue {
  getCurrentName!: string;

  getUsers!: userInterface[];

  currentUser(): userInterface | undefined {
    return this.getUsers.find((u) => u.name === this.getCurrentName);
  }

  get longRoute(): number | undefined {
    const user = this.currentUser();
    return user ? user.hand.longRoute : -1;
  }

  get shortRoute(): number[] {
    const user = this.currentUser();
    return user ? user.hand.shortRoute : [];
  }

  get cardsInHand(): [string, number][] {
    const cards = this.currentUser()?.hand.cards;
    if (!cards) return [];
    const arrayOfCards = Object.entries(cards).filter((card) => card[1] > 0);
    return arrayOfCards;
  }

  get currentColor(): string {
    const user = this.currentUser();
    return user ? user.color : '';
  }
}
</script>

<style lang="scss" scoped>
.game-player {
  width: 100%;
  display: flex;
}
.player-box {
  display: flex;
  // flex-direction: column;
  flex-basis: 100%;
  padding: 2rem;
  border: 0.5rem solid var(--user-color);
  list-style: none;
}
.player-card {
  flex-direction: row;
  flex-wrap: wrap;
}
.player-box__item {
  width: 9rem;
}

.card {
  // border: 0.3rem solid var(--user-color);
  border: 0.1rem solid;
  border-radius: 1rem;
  width: 16.2rem;
  height: 10rem;
}
.card-value {
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  background: #000;
  border-radius: 50%;
  color: red;
}
.player-route {
  .card {
    transform: rotate(45deg);
  }
}
.player-card {
  .card {
    transform: rotate(-45deg);
  }
}
</style>
