<template>
  <aside class="deck-side">
    <div class="deck deck-route">
      маршруты
    </div>
    <ul class="table-card">
      <li
      :key="card"
      v-for="card in getCardTable"
      class="deck"
      > {{ card }} </li>
    </ul>
    <div class="deck deck-card">
      колода
    </div>
  </aside>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters([
      'getUsers',
      'getTurn',
      'getRouteDeck',
      'getCardDeck',
      'getCardTable',
    ]),
  },
  components: {},
})

export default class DeckSide extends Vue {
getCardTable!: string[];

getRouteDeck!: number[];

getCardDeck!: number[];
}
</script>

<style lang="scss" scoped>
.deck-side{
  max-width: 30rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}
.deck {
  width: 80%;
  border-radius: 1rem;
  border: 0.1rem solid #0e2e3a;
  height: 8rem;
  text-align: center;
  vertical-align: middle;
}
.table-card {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem
}
</style>
