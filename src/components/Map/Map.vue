<template>
  <div class="game-field">
    <svg
      class="game-field__img"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      id="svg5"
      width="2048"
      height="1380"
      version="1.1"
      viewBox="0 0 2048 1380"
    >
      <image
        xlink:href="assets/map/gamefield.jpg"
        id="image17"
        width="2048"
        height="1380"
        x="2.75"
        y="1.375"
        preserveAspectRatio="none"
        style="stroke-width: 3; stroke-miterlimit: 4; stroke-dasharray: none"
      />
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
  width: 100%;
  &__img {
    max-width: 98vw;
    height: min-content;
    width: 100%;
    max-height: 80vh;
  }
}
</style>
