<template>
  <div class="content">
    <h3>Подготовка</h3>
    <h5>Вы можете сбросить маршруты, но должны оставить минимум 2</h5>
    <ul class="route-list" @click="markToDiscard">
      <li class="route route__long"
      >Маршрут номер {{ longRoute }}</li>
      <li class="route" :key="route"
      v-for="route in shortRoute"
      :data-route="route"
      >Маршрут номер {{ route }}</li>
    </ul>
    <p>Примечание: за невыполненные карточки вы получите штраф.</p>
    <Btn title="Применить"
      class="btn-accept btn-prepare"
      :method="acceptDiscard"
      />
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import userInterface from '../interface/user';
import Btn from '../Button/Btn.vue';
import Storage from '../localStorage/storage';

@Component({
  computed: {
    ...mapGetters(['getUsers']),
  },
  components: {
    Btn,
  },
})
export default class Prepare extends Vue {
  @Prop({ default: 0 }) private timer!: number;

  currentTimer = 0;

  getUsers!: userInterface[];

  storage = new Storage();

  userName = this.storage.data.name;

  discard: Array<string|number> = [];

  mounted(): void {
    if (this.timer) this.currentTimer = this.timer;
    const prepareTimer = setInterval(() => {
      this.currentTimer -= 0.1;
      if (this.currentTimer <= 0.1) {
        clearInterval(prepareTimer);
        this.$emit('get-discarded', this.discard);
      }
    }, 100);
  }

  get currentUser(): userInterface {
    return this.getUsers.filter((user) => user.name === this.userName)[0];
  }

  get longRoute(): number | undefined {
    return this.currentUser.hand.longRoute;
  }

  get shortRoute(): number[] {
    return this.currentUser.hand.shortRoute;
  }

  get cards(): Record<string, number> {
    return this.currentUser.hand.cards;
  }

  acceptDiscard(): void {
    this.currentTimer = 0.1;
    this.$emit('close-modal');
  }

  markToDiscard(e: MouseEvent): void {
    if (e.target instanceof Element) {
      const { target } = e;
      if (target.classList.contains('discard')) {
        target.classList.remove('discard');
        if (target.classList.contains('route__long')) {
          const index = this.discard.indexOf('long');
          this.discard.splice(index, 1);
        } else {
          const value = Number(target.getAttribute('data-route'));
          const index = this.discard.indexOf(value);
          this.discard.splice(index, 1);
        }
      } else if (this.discard.length < 2) {
        target.classList.add('discard');
        if (target.classList.contains('route__long')) {
          this.discard.push('long');
        } else {
          const value = Number(target.getAttribute('data-route'));
          this.discard.push(value);
        }
      }
    }
  }
}

</script>

<style lang="scss" scoped>

.route-list{
  display: flex;
  width: 100%;
  justify-content: space-between;
  list-style: none;
}

.route{
  font-size: 1.6rem;
  width: 22%;
  background-color: rgb(129, 129, 129);
  cursor: pointer;
  transition: all 0.3s;

  &__long{
    background-color: rgb(91, 144, 204);
  }

  &.discard{
    filter: blur(.3rem);
  }
}

.btn-prepare{
  margin: 1rem auto;
}

</style>
