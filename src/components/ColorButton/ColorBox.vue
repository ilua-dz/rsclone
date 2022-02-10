<template>
  <div class="color-box" :style="{ top, left }">
    <div
      :key="i"
      v-for="(color, i) in colors"
      style="max-width: 40px; max-height: 40px; height: 30%; width: 30%"
      class="color-box__button"
      :class="{ disabled: usedColors.includes(color) && color != currentColor }"
      :style="{
        backgroundColor: color,
        cursor: usedColors.includes(color) ? 'unset' : 'pointer',
        border: color === currentColor ? '2px solid hotpink' : '',
      }"
      :data-color="color"
      @click="
        changeColor($event);
        $emit('hide-modal', select);
      "
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ColorBox extends Vue {
  @Prop({ default: () => [] }) private usedColors!: string[];

  @Prop({ default: 0 }) private x!: number;

  @Prop({ default: 0 }) private y!: number;

  @Prop({ default: '' }) private currentColor!: string;

  colors = [
    '#F0EFEB',
    '#43AA8C',
    '#3A86FE',
    '#D62828',
    '#E36F6F',
    '#8338EB',
    '#FCBF4A',
    '#3C3C3C',
    '#48CAE4',
  ];

  select = '';

  get top(): string {
    return `${this.y}px`;
  }

  get left(): string {
    return `${this.x}px`;
  }

  changeColor(e: Event): void {
    if (e.target instanceof Element) {
      const { target } = e;
      let targetColor: string | null = target.getAttribute('data-color');
      if (!targetColor) targetColor = '';
      if (!this.usedColors.includes(targetColor)) {
        this.select = targetColor;
      }
      if (targetColor === this.currentColor) {
        this.select = targetColor;
      }
      this.$store.commit('setCurrentColor', this.select);
      this.$emit('change-color', this.select);
    }
  }
}
</script>

<style lang="scss" scoped>
.color-box {
  width: 120px;
  height: 120px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  position: absolute;
  background-color: rgb(117, 161, 155);
  transform: translate(-50%, -50%);
  justify-content: center;
  align-content: center;
  z-index: 5;

  &__button {
    box-sizing: border-box;
  }
}

.disabled {
  position: relative;
  &:after {
    content: '';
    width: 2px;
    height: 140%;
    transform: translate(-50%, -50%) rotate(315deg);
    background-color: red;
    position: absolute;
    top: 50%;
    left: 50%;
    cursor: unset;
  }
}
</style>
