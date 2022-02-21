<template>
  <div class="game-player" :style="{ '--user-color': currentColor }">
    <div class="table-background"></div>
    <ul class="player-box player-route">
      <!--
      <li class="route route__long player-box__item" v-if="longRoute != -1">
        <div
          class="card"
          :class="{complete: getCompletedTasks.includes(taskInfo[longRoute + 40])}"
          :style="{
            background:
              'center / contain no-repeat url(/assets/game/route_cards/' +
              (+longRoute + 41) +
              '.avif)',
          }"
        ></div>
      </li>
      -->
      <li
        class="route player-box__item"
        :key="task.id"
        v-for="(task, index) in currentTasks"
        :data-route="task.id"
      >
        <div
          class="card-value"
          :class="{
            complete: completedTasks.find((completedTask) => completedTask.id === task.id),
          }"
          @mouseover="showRouteInfo(task.cities), takeCardPlaySound()"
          @mouseleave="hideRouteInfo"
        >
          {{ task.points }}
        </div>
        <div
          class="card"
          :style="{
            background: `center / contain no-repeat url(./assets/game/route_cards/${
              task.id + 1
            }.png)`,
            '--card-num': index,
          }"
        ></div>
      </li>
    </ul>
    <!-- <ul class="player-box player-card"> -->
    <transition-group name="slide-down" tag="ul" class="player-box player-card" appear="appear">
      <li
        class="player-box__item"
        :key="index"
        v-for="(card, index) in cardsInHand"
        v-show="card[1] > 0"
      >
        <div class="card-value" @mouseover="takeCardPlaySound">
          {{ card[1] }}
        </div>
        <div
          class="card"
          :style="{
            background: `center / contain no-repeat url(./assets/game/wagon_cards/${card[0]}.png)`,
          }"
        ></div>
      </li>
    </transition-group>
    <!-- </ul> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import taskInterface from '../interface/taskInterface';
import taskInfo from '../../store/user/taskInfo';
import playSound from '../../utils/sounds/index';

@Component({
  computed: {
    ...mapGetters(['getUsers', 'getCurrentName', 'getCompletedLength']),
  },
})
export default class PlayerSide extends Vue {
  getCurrentName!: string;

  getUsers!: userInterface[];

  taskInfo = taskInfo;

  playSound = playSound;

  @Watch('getCompletedLength') onLengthChange(): void {
    this.playSound('taskCompleted');
  }

  get currentUser(): userInterface | undefined {
    return this.getUsers.find((u) => u.name === this.getCurrentName);
  }

  get currentTasks(): taskInterface[] | undefined {
    return this.currentUser?.hand.currentTasks;
  }

  get completedTasks(): taskInterface[] | undefined {
    return this.currentUser?.hand.completedTasks;
  }

  get cardsInHand(): [string, number][] {
    const cards = this.currentUser?.hand.cards;
    if (!cards) return [];
    const arrayOfCards = Object.entries(cards);
    return arrayOfCards;
  }

  get currentColor(): string {
    const user = this.currentUser;
    return user ? user.color : '';
  }

  showRouteInfo(cities: string[]): void {
    this.$emit('showCities', cities);
  }

  hideRouteInfo(): void {
    this.$emit('hideCities');
  }

  takeCardPlaySound(): void {
    this.playSound('takeCard');
  }
}
</script>

<style lang="scss" scoped>
.game-player {
  position: relative;
  width: 100%;
  height: 11rem;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  border: double;
  border-radius: 2.5rem;
  box-shadow: var(--any-table-shadow);
}
.table-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: center no-repeat url('../../assets/game/table.jpg') var(--user-color);
  background-blend-mode: multiply;
  filter: grayscale(50%);
  border-radius: 2rem;
}
.player-box {
  position: relative;
  display: flex;
  padding: 1.5rem;
  list-style: none;
  gap: 1rem;
}
.player-card {
  flex-direction: row;
  flex-wrap: wrap;
}
.player-box__item {
  width: 6.5rem;
  height: 10rem;
  transition: all 0.5s;
  position: relative;
}

.card {
  width: 16.2rem;
  height: 10rem;
  border: 0.1rem solid black;
  border-radius: 1rem;
  transition: all 0.5s;
  position: relative;
}
.player-route {
  width: 50%;
  .card {
    transform: translateY(-2rem) rotateX(45deg) rotate(45deg);
    &.browse {
      transform: translate(300%, -4rem) scale(1.5);
    }
  }
}
.player-card {
  position: relative;
  width: 50%;
  padding-right: 10.5rem;
  justify-content: flex-end;
  .card {
    transform: translateY(-2rem) rotateX(45deg) rotate(-45deg);
  }
}
.card-value {
  position: absolute;
  bottom: 0;
  z-index: 2;
  transform: rotate(0) translate(4.2rem, 0rem);
  width: max-content;
  min-width: 3.5rem;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  text-align: center;
  border-radius: 2rem;
  border: groove;
  background: rgb(41, 41, 41);
  color: yellow;
  text-shadow: 0 0 3px white, 0 0 5px white;
  transition: all 0.5s;
  cursor: pointer;
  &:hover {
    background: rgb(87, 87, 87);
  }
  &:hover + .card {
    z-index: 1;
    transform: scale(1.2) translate(-2rem, -10rem) rotate(0deg);
    box-shadow: var(--card-shadow);
  }
}
.route {
  .card-value {
    transform: translate(8.6rem, 0rem);
    color: red;
    text-shadow: 0 0 3px red, 0 0 5px red;
    &:hover + .card {
      z-index: 1;
      transform: scale(2) translate(calc(1rem - 3.25rem * var(--card-num)), -13rem) rotate(90deg);
      box-shadow: var(--card-shadow);
    }
    &.complete {
      color: greenyellow;
      text-shadow: 0 0 3px greenyellow, 0 0 5px greenyellow;
    }
  }
}
.slide-down {
  &-move {
    transition: all 0.5s;
  }
  &-enter-active {
    transition: all 0.5s ease-in-out;
    position: absolute;
  }
  &-enter {
    transform: translateY(-100%);
  }
}
</style>
