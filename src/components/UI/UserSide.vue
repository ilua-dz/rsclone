<template>
  <aside class="user-side">
    <ul class="user-list">
      <li
      :key="user.name"
      v-for="user in getUsers"
      :class="{active: user===activePlayer}"
      class="user-item">
      <div class="user-info">
        <div class="user-color" :style="{ backgroundColor: user.color }"></div>
        <h3 class="user-name"> {{ user.name }}</h3>
      </div>
      <div class="user-stat">
        <div class="stat-block card-block">
          <div>Карты</div>
          <div>{{Object.values(user.hand.cards).reduce((sum, value) => sum + value, 0)}}</div>
        </div>
        <div class="stat-block route-block">
          <div>Маршруты</div>
          <div>{{user.hand.shortRoute.length + (user.hand.longRoute === -1 ? 0 : 1)}}</div>
        </div>
        <div class="stat-block train-block">
          <div>Вагоны</div>
          <div>{{user.hand.trains}}</div>
        </div>
      </div>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';

@Component({
  computed: { ...mapGetters(['getUsers', 'getTurn']) },
  components: {},
})
export default class UserSide extends Vue {
  @Prop({ default: 0 }) private timer!: number;

  getUsers!:userInterface[];

  getTurn!: number;

  get activePlayer(): userInterface {
    return this.getUsers[this.getTurn];
  }
}

</script>

<style lang="scss" scoped>
.user-side {
  max-width: 37rem;
  width: 100%;
  padding-top: 3rem;
}
.user-list{
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: stretch;
  padding: 1rem;
}
.user-item {
  padding: 2rem;
  border: 0.1rem solid rgb(139, 89, 24);
  border-radius: 1rem;
  display: flex;
  transform: scale(0.9);

  &.active {
    transform: scale(1.0);
    box-shadow: 0 0 1rem 0.3rem rgb(139, 89, 24);
  }
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-color {
  width: 6rem;
  height: 6rem;
  border-radius: 50rem;
  border: 0.5rem solid rgb(139, 89, 24);
}
.user-stat {
  display: flex;
}
</style>
