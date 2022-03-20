<template>
  <use
    xlink:href="assets/map/city-marker.svg#point"
    :x="city.x"
    :y="city.y"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    :style="{'--user-color': getCurrentColor}"
    style="transform: translate(-594px, -370px)"
    class="city-point"
    :class="{ show , hovered: isHover && isUserActive}"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ICity from '../interface/ICity';
import userInterface from '../interface/user';

@Component({
  computed: {
    ...mapGetters(['getUsers', 'getCurrentColor', 'getCompletedLength']),
  },
})
export default class City extends Vue {
  @Prop({ default: [] }) private city!: ICity;

  @Prop({ default: [] }) show!: boolean;

  @Prop({ default: [] }) private isUserActive!: boolean;

  getCurrentColor!: string

  getUsers!: userInterface[];

  isHover = false;
}
</script>

<style lang="scss" scoped>
.station {
  &_available {
    fill: transparent;
  }

  &_builded {
    pointer-events: none;
    stroke: #000;
  }
}

.city-point {
  opacity: 0.8;
  transition: 0.5s;
  &.show {
    opacity: 0.9;
    fill: yellow;
    filter: drop-shadow(0px 0px 20px red) drop-shadow(0px 0px 20px red);
    animation: city-animation 0.4s alternate infinite;
    stroke: #000;
  }
}

.hovered {
  opacity: 0.8;
  cursor: pointer;
  fill: var(--user-color);
  stroke: #000;
  filter: drop-shadow(0px 0px 20px var(--user-color)) drop-shadow(0px 0px 20px red);
}

@keyframes city-animation {
  from {
    filter: drop-shadow(0px 0px 20px yellow) drop-shadow(0px 0px 20px yellow);
  }
}
</style>
