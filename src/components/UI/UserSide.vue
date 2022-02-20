<template>
  <aside class="user-side">
    <ul class="user-list">
      <li
        :key="user.name"
        v-for="user in getUsers"
        :class="{ active: user === activePlayer }"
        class="user-item"
        :style="{
          border: 'groove' + user.color,
        }"
      >
        <div class="user-info">
          <div
            class="user-avatar"
            :style="{
              background:
                'center / contain no-repeat url(' +
                avatars.filter((av) => av.color === user.color)[0].avatar +
                ')' +
                user.color,
              border: 'groove' + user.color,
            }"
          >
            <div class="user-points" :style="{ border: 'outset' + user.color }">
              {{ user.points }}
            </div>
          </div>
        </div>
        <div class="user-stat">
          <h3 class="user-name">{{ user.name }}</h3>
          <div class="stat-block card-block">
            <img
              src="../../assets/game/wagon_cards/wagon-shirt.png"
              alt="карта вагона"
              class="card-shirt-icon"
            />
            <div>{{ Object.values(user.hand.cards).reduce((sum, value) => sum + value, 0) }}</div>
          </div>
          <div class="stat-block route-block">
            <img
              src="../../assets/game/route_cards/route-shirt.png"
              alt="карта маршрута"
              class="card-shirt-icon"
            />
            <div>{{ user.hand.currentTasks.length }}</div>
          </div>
          <div class="stat-block train-block">
            <WagonIcon :style="{ '--user-color': user.color }" class="card-shirt-icon" />
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
import WagonIcon from './WagonIcon.vue';

@Component({
  computed: { ...mapGetters(['getUsers', 'getTurn']) },
  components: { WagonIcon },
})
export default class UserSide extends Vue {
  @Prop({ default: 0 }) private timer!: number;

  getUsers!: userInterface[];

  getTurn!: number;

  get activePlayer(): userInterface {
    return this.getUsers[this.getTurn % this.getUsers.length];
  }

  avatars = avatars;
}
</script>

<style lang="scss" scoped>
.user-side {
  padding: 1rem;
  border: double;
  border-radius: 2.5rem;
  background: rgb(212, 212, 212);
  box-shadow: var(--any-table-shadow);
}
.user-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  list-style: none;
}
.user-item {
  width: 35rem;
  padding: 1rem;
  border: 0.1rem solid rgb(139, 89, 24);
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  background: whitesmoke;
  box-shadow: 0 0 1rem 0.3rem white;
  &.active {
    animation: blur 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) alternate infinite;
  }
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-avatar {
  position: relative;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
}
.user-points {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  min-width: 3.5rem;
  padding: 0.2rem;
  text-align: center;
  border-radius: 2rem;
  background: rgb(223, 217, 209);
}
.user-name {
  width: 100%;
}
.user-stat {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.card-shirt-icon {
  width: 6rem;
  max-height: 3.5rem;
  border-radius: 0.5rem;
  border: 1px solid;
  background: rgb(223, 217, 209);
}
.stat-block {
  width: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
  transition: 0.3s;
}
.stat-block:hover {
  z-index: 5;
  transform: scale(2) rotate(10deg);
}

@keyframes blur {
  from {
    box-shadow: 0 0 1rem 0.3rem rgb(58, 51, 51);
  }
}
</style>
