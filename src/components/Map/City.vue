<template>
  <use
    xlink:href="/assets/map/city-marker.svg#point"
    :x="city.x"
    :y="city.y"
    style="transform: translate(-594px, -370px)"
    class="city-point"
    :class="{ show }"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class City extends Vue {
  @Prop({ default: [] }) private city!: { x: string; y: string; id: number; name: string };

  show = false;

  showCity(city: string): void {
    if (city === this.city.name) this.show = true;
  }
}
</script>

<style lang="scss" scoped>
.city-point {
  opacity: 0;
  transition: 0.5s;
  &.show {
    opacity: 1;
  }
}
</style>
