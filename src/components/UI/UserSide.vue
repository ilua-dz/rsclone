<template>
  <aside class="user-side">
    <ul class="user-list">
      <li
        :key="user.name"
        v-for="user in getUsers"
        :class="{ active: user === activePlayer }"
        class="user-item"
      >
        <div class="user-info">
          <div
            class="user-color"
            :style="{
              background:
                'center / contain no-repeat url(' +
                avatars.filter((av) => av.color === user.color)[0].avatar +
                ')' +
                user.color,
              border: '0.4rem solid' + user.color,
            }"
          ></div>
          <h3 class="user-name">{{ user.name }}</h3>
        </div>
        <div class="user-stat">
          <div class="stat-block card-block">
            <!-- <div>Карты</div> -->
            <img
              src="assets/game/wagon_cards/wagon-shirt.avif"
              alt="карта вагона"
              class="card-shirt-icon"
            />
            <div>{{ Object.values(user.hand.cards).reduce((sum, value) => sum + value, 0) }}</div>
          </div>
          <div class="stat-block route-block">
            <!-- <div>Маршруты</div> -->
            <img
              src="assets/game/route_cards/route-shirt.avif"
              alt="карта маршрута"
              class="card-shirt-icon"
            />
            <div>{{ user.hand.shortRoute.length + (user.hand.longRoute === -1 ? 0 : 1) }}</div>
          </div>
          <div class="stat-block train-block">
            <!-- <div>Вагоны</div> -->
            <img src="assets/game/wagon-icon.svg" alt="вагон" class="card-shirt-icon" />
            <div>{{ user.hand.trains }}</div>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import avatars from '../../enums/avatars';

@Component({
  computed: { ...mapGetters(['getUsers', 'getTurn']) },
  components: {},
})
export default class UserSide extends Vue {
  @Prop({ default: 0 }) private timer!: number;

  getUsers!: userInterface[];

  getTurn!: number;

  get activePlayer(): userInterface {
    return this.getUsers[this.getTurn];
  }

  avatars = avatars;
}
</script>

<style lang="scss" scoped>
.user-side {
  max-width: 32rem;
  width: 100%;
  padding-top: 3rem;
}
.user-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: stretch;
  padding: 1rem;
  list-style: none;
}
.user-item {
  padding: 1rem;
  border: 0.1rem solid rgb(139, 89, 24);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  // transform: scale(0.9);

  &.active {
    // transform: scale(1);
    box-shadow: 0 0 1rem 0.3rem rgb(139, 89, 24);
  }
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-color {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
}
.user-stat {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.card-shirt-icon {
  width: 6rem;
  max-height: 3.5rem;
  border-radius: 0.5rem;
  border: 1px solid;
}
.stat-block {
  width: 10rem;
  display: flex;
  align-items: center;
  column-gap: 1rem;
  transition: 0.3s;
}
.stat-block:hover {
  z-index: 5;
  transform: scale(2) rotate(10deg);
}
</style>
