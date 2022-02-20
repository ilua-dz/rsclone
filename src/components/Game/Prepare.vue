<template>
  <div class="content">
    <h3>Подготовка</h3>
    <h5>Вы можете сбросить маршруты, но должны оставить минимум {{ checkPickRoute ? 1 : 2 }}</h5>
    <ul class="route-list" >
    <!--
      <li class="route route__long" v-if="!checkPickRoute">Маршрут номер {{ longRoute }}</li>
    -->
      <li class="route"
      :key="task.id"
      v-for="task in currentTasks"
      @click="markToDiscard($event, task)"
      :data-route="task.id">
        Маршрут номер {{ task.id }}
      </li>
    </ul>
    <p>Примечание: за невыполненные карточки вы получите штраф.</p>
    <Btn title="Применить" class="btn-accept btn-prepare" :method="acceptDiscard" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import Btn from '../Button/Btn.vue';
import taskInterface from '../interface/taskInterface';
// import Storage from '../localStorage/storage';

@Component({
  computed: {
    ...mapGetters([
      'getUsers',
      'getCurrentName',
    ]),
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

  // storage = new Storage();

  // userName = this.storage.data.name;

  discard: taskInterface[] = [];

  prepareTimer = setInterval(() => {
    this.currentTimer -= 0.1;
    if (this.currentTimer <= 0.1) {
      this.acceptDiscard();
    }
  }, 100);

  // mounted(): void {
  // }

  get checkPickRoute(): boolean {
    return this.pickedRoutes.length > 0;
  }

  get currentUser(): userInterface {
    return this.getUsers.filter((user) => user.name === this.getCurrentName)[0];
  }

  get currentTasks(): taskInterface[] | undefined {
    return this.checkPickRoute ? this.pickedRoutes : this.currentUser?.hand.currentTasks;
  }

  // get longRoute(): number | undefined {
  //   return this.currentUser.hand.longRoute;
  // }

  // get shortRoute(): number[] {
  //   return this.checkPickRoute ? this.pickedRoutes : this.currentUser.hand.shortRoute;
  // }

  get cards(): Record<string, number> {
    return this.currentUser.hand.cards;
  }

  acceptDiscard(): void {
    if (this.prepareTimer) clearInterval(this.prepareTimer);
    console.log(this.discard);
    if (this.checkPickRoute) {
      this.$socket.emit('addShortRoute', this.getCurrentName, this.pickedRoutes);
      this.discard.forEach((route) => {
        this.$socket.emit('discardRoute', this.getCurrentName, route);
      });
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
          // const value = Number(target.getAttribute('data-route'));
          const index = this.discard.indexOf(task);
          this.discard.splice(index, 1);
        }
      } else if (this.discard.length < numOfDiscard) {
        target.classList.add('discard');
        if (target.classList.contains('route__long')) {
          this.discard.push(task);
        } else {
          // const value = Number(target.getAttribute('data-route'));
          this.discard.push(task);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.route-list {
  display: flex;
  width: 100%;
  justify-content: space-between;
  list-style: none;
}

.route {
  font-size: 1.6rem;
  width: 22%;
  background-color: rgb(129, 129, 129);
  cursor: pointer;
  transition: all 0.3s;

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
