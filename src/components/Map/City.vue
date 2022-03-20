<template>
  <use
    xlink:href="assets/map/city-marker.svg#point"
    :x="city.x"
    :y="city.y"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    :style="{ '--user-color': getCurrentColor }"
    style="transform: translate(-594px, -370px)"
    class="city-point"
    :class="{ show , hovered: isHover && isUserActive}"
    fill="white"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['getUsers', 'getCurrentColor', 'getCompletedLength']),
  },
})
export default class City extends Vue {
  @Prop({ default: [] }) private city!: { x: string; y: string; id: number; name: string };

  @Prop({ default: [] }) show!: boolean;

  @Prop({ default: [] }) private isUserActive!: boolean;

  getCurrentColor!: string

  isHover = false;
}
</script>

<style lang="scss" scoped>
.city-point {
  opacity: 0;
  transition: 0.5s;
  filter: drop-shadow(0px 0px 20px red) drop-shadow(0px 0px 20px red);
  fill: yellow;
  &.show {
    opacity: 0.8;
    animation: city-animation 0.4s alternate infinite;
  }
}

.hovered {
  opacity: 0.8;
  cursor: pointer;
  fill: var(--user-color);
  filter: drop-shadow(0px 0px 20px var(--user-color));
  stroke: rgb(0, 0, 0);
}

@keyframes city-animation {
  from {
    filter: drop-shadow(0px 0px 20px yellow) drop-shadow(0px 0px 20px yellow);
  }
}
</style>
