<template>
  <div class="color-box" :style="{ top, left }">
    <div
      :key="i"
      v-for="(avatar, i) in avatars"
      style="height: 32%; width: 32%"
      class="color-box__button"
      :class="{
        disabled: usedColors.includes(avatar.color) && avatar.color != currentColor,
        active: avatar.color === currentColor,
      }"
      :style="{
        background: 'center / contain no-repeat url(' + avatar.avatar + ')' + avatar.color,
        cursor: usedColors.includes(avatar.color) ? 'unset' : 'pointer',
        boxShadow: '0 0 0 1px ' + avatar.color,
        border: '3px solid ' + avatar.color,
      }"
      :data-color="avatar.color"
      @click="
        changeColor($event);
        $emit('hide-modal', select);
      "
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import avatars from '../../enums/avatars';

@Component
export default class ColorBox extends Vue {
  @Prop({ default: () => [] }) private usedColors!: string[];

  @Prop({ default: 0 }) private x!: number;

  @Prop({ default: 0 }) private y!: number;

  @Prop({ default: '' }) private currentColor!: string;

  select = '';

  avatars = avatars;

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
  width: 30rem;
  height: 30rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  position: absolute;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-content: center;
  z-index: 5;

  &__button {
    box-sizing: border-box;
    transition: 0.3s;
  }

  &__button:hover {
    z-index: 6;
    border-radius: 50%;
    transform: scale(1.3);
  }
}

.disabled {
  position: relative;
  pointer-events: none;
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

.active {
  z-index: 5;
  transform: scale(1.2);
  border-radius: 50%;
}
</style>
