<template>
  <div class="game-field">
    <svg
      class="game-field__img"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      id="svg5"
      version="1.1"
      viewBox="0 0 2048 1380"
    >
      <image xlink:href="assets/map/gamefield.jpg" id="image17" />
      <Railway
        :key="railway.id"
        v-for="railway in getRailways"
        :railway="railway"
        :data-path="railway.id"
        :users="getUsers"
      />
    </svg>
  </div>
</template>

<script lang="ts">
// import Prop if i will use props
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import railwayInterface from '../interface/railway';
import Railway from './Railway.vue';

@Component({
  computed: { ...mapGetters(['getRailways', 'getUsers']) },
  components: {
    Railway,
  },
})
export default class Map extends Vue {
  // @Prop({ default: [] }) private railways!: railwayInterface[];
  // get mapGetters('getRailways') ,
  getRailways!: railwayInterface[];

  // railways = this.getRailways;

  // mounted(): void {
  // console.log(this.getRailways);
  // }
}
</script>

<style lang="scss" scoped>
.game-field {
  display: flex;
  align-items: flex-start;
  border-radius: 2rem;
  border: 0.2rem solid rgb(139, 89, 24);
  overflow: hidden;
  background: rgb(165, 165, 165);
  &__img {
    // max-width: 98vw;
    // height: min-content;
    height: 85vh;
    // max-height: 82vh;
  }
}
</style>
