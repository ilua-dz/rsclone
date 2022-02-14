<template>
  <div class="game-player" :style="{ '--user-color': currentColor }">
    <ul class="player-box player-route">
      <li
        class="route route__long player-box__item card"
        v-if="longRoute != -1"
        :style="{
          background:
            'center / contain no-repeat url(/assets/game/route_cards/' +
            (+longRoute + 41) +
            '.avif)',
        }"
      >
        <!-- Маршрут номер {{ longRoute }} -->
      </li>
      <li
        class="route player-box__item card"
        :key="route"
        v-for="route in shortRoute"
        :data-route="route"
        :style="{
          background: 'center / contain no-repeat url(/assets/game/route_cards/' + route + '.avif)',
        }"
      >
        <!-- Маршрут номер {{ route }} -->
      </li>
    </ul>
    <ul class="player-box player-card">
      <li
        class="player-box__item card"
        :key="card[0]"
        v-for="card in cardsInHand"
        :style="{
          background:
            'center / contain no-repeat url(/assets/game/wagon_cards/' + card[0] + '.avif)',
        }"
      >
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
  gap: 1rem;
}
.player-card {
  flex-direction: row;
  flex-wrap: wrap;
}
.player-box__item {
  padding: 2rem;
  border: 0.1rem solid var(--user-color);
  border-radius: 1rem;
}

.card {
  width: 16.2rem;
  height: 10rem;
}
</style>
