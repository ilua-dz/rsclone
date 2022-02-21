<template>
  <div class="content">
    <h3>Подготовка к игре</h3>
    <p>Вы можете сбросить маршруты, но должны оставить минимум {{ checkPickRoute ? 1 : 2 }}</p>
    <ul class="route-list">
      <li
        class="route"
        :key="task.id"
        v-for="task in currentTasks"
        @click="markToDiscard($event, task)"
        :data-route="task.id"
        :style="{
          background: `center / contain no-repeat url(./assets/game/route_cards/${
            task.id + 1
          }.png)`,
        }"
      >
      </li>
    </ul>
    <p class="attention">Примечание: за невыполненные карточки вы получите штраф.</p>
    <Btn title="Применить" class="btn-accept btn-prepare" :method="acceptDiscard" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import Btn from '../Button/Btn.vue';
import taskInterface from '../interface/taskInterface';

@Component({
  computed: {
    ...mapGetters(['getUsers', 'getCurrentName']),
  },
  components: {
    Btn,
  },
})
export default class Prepare extends Vue {
  @Prop({ default: 0 }) private timer!: number;

  @Prop({ default: Array }) private pickedRoutes!: taskInterface[];

  currentTimer = this.timer || 0;

  getUsers!: userInterface[];

  getCurrentName!: string;

  discard: taskInterface[] = [];

  prepareTimer = setInterval(() => {
    this.currentTimer -= 0.1;
    if (this.currentTimer <= 0.1) {
      this.acceptDiscard();
    }
  }, 100);

  get checkPickRoute(): boolean {
    return this.pickedRoutes.length > 0;
  }

  get currentUser(): userInterface {
    return this.getUsers.filter((user) => user.name === this.getCurrentName)[0];
  }

  get currentTasks(): taskInterface[] | undefined {
    return this.checkPickRoute ? this.pickedRoutes : this.currentUser?.hand.currentTasks;
  }

  get cards(): Record<string, number> {
    return this.currentUser.hand.cards;
  }

  acceptDiscard(): void {
    if (this.prepareTimer) clearInterval(this.prepareTimer);
    if (this.checkPickRoute) {
      this.$socket.emit('addShortRoute', this.getCurrentName, this.pickedRoutes);
      this.$emit('get-discarded', this.discard);
    } else {
      this.$emit('get-discarded', this.discard);
    }
    this.$emit('close-modal');
  }

  markToDiscard(e: MouseEvent, task: taskInterface): void {
    if (e.target instanceof Element) {
      const { target } = e;
      const length = target.parentNode?.children.length || 0;
      let numOfDiscard: number;
      if (length <= 3) {
        numOfDiscard = length - 1;
      } else {
        numOfDiscard = 2;
      }
      if (target.classList.contains('discard')) {
        target.classList.remove('discard');
        if (target.classList.contains('route__long')) {
          const index = this.discard.indexOf(task);
          this.discard.splice(index, 1);
        } else {
          const index = this.discard.indexOf(task);
          this.discard.splice(index, 1);
        }
      } else if (this.discard.length < numOfDiscard) {
        target.classList.add('discard');
        if (target.classList.contains('route__long')) {
          this.discard.push(task);
        } else {
          this.discard.push(task);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.route-list {
  display: flex;
  width: 100%;
  justify-content: space-between;
  column-gap: 1rem;
  list-style: none;
}

.route {
  font-size: 1.6rem;
  width: 22%;
  cursor: pointer;
  transition: all 0.3s;
  width: 23.5rem;
  height: 14.5rem;
  border: 0.1rem solid black;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);

  &:hover {
    z-index: 5;
    transform: rotate(-3deg) scale(1.05);
    box-shadow: 0 0 1rem 0.3rem white;
  }
  &:active {
    transform: rotate(3deg) scale(1.05);
  }

  &__long {
    background-color: rgb(91, 144, 204);
  }

  &.discard {
    filter: blur(0.3rem);
  }
}

.btn-prepare {
  margin: 1rem auto;
}
</style>
