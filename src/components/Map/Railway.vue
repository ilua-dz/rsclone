<template>
  <g
    class="route"
    :transform="transform"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    :class="{ hovered: isHover && isUserActive }"
    :style="{ '--user-color': userColor }"
  >
    <Train :key="train.x" v-for="train in railway.train" :train="train" />
  </g>
</template>

<script lang="ts">
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

  computed: {
    cssVars() {
      return {};
    },
  },
})
export default class Railway extends Vue {
  @Prop({ default: [] }) private railway!: railwayInterface;

  @Prop({ default: [] }) private users!: userInterface[];

  @Prop({ default: [] }) private isUserActive!: boolean;

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
    fill: transparent;
  }

  &_builded {
    pointer-events: none;
    stroke: rgb(0, 0, 0);
  }
}

.hovered {
  cursor: pointer;
  fill: var(--user-color);
  filter: drop-shadow(5px 5px 15px var(--user-color));
  stroke: rgb(0, 0, 0);
}
</style>
