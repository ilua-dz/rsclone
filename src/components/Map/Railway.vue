<template>
  <g
    class="route"
    :transform="transform"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    :class="{ hovered: isHover }"
    :style="{ '--user-color': userColor }"
  >
    <Train :key="train.x" v-for="train in railway.train" :train="train" />
  </g>
</template>

<script lang="ts">
// import Prop if i will use props
import { Component, Prop, Vue } from 'vue-property-decorator';
import railwayInterface from '../interface/railway';
import userInterface from '../interface/user';
import Train from './Train.vue';
import Storage from '../localStorage/storage';

const storage = new Storage();

@Component({
  components: {
    Train,
  },

  // cssVars didn't work, so i use style at this moment

  computed: {
    cssVars() {
      return {};
    },
  },
})
export default class Railway extends Vue {
  @Prop({ default: [] }) private railway!: railwayInterface;

  @Prop({ default: [] }) private users!: userInterface[];

  transform = this.railway.transform;

  isHover = false;

  get userColor(): string {
    let color = this.users.find((u) => u.name === storage.data.name)?.color;
    if (!color) color = '';
    return color;
  }
}
</script>

<style lang="scss" scoped>
.route {
  transition: 0.3s ease-out;

  &_available {
    cursor: pointer;
    fill: transparent;
  }
}

.hovered {
  fill: var(--user-color);
  filter: drop-shadow(5px 5px 15px var(--user-color));
  stroke: rgb(0, 0, 0);
}
</style>
