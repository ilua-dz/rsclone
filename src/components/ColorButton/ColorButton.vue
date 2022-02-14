<template>
  <button
    :class="[{ clickable: clickable }, showModal ? 'overlay' : 'color-button']"
    :style="{ backgroundColor: currentColor, cursor: clickable ? 'pointer' : 'unset' }"
    @click="open($event, usedColors, currentColor)"
  >
    {{ clickable ? 'Выбрать цвет' : '' }}
    <transition name="fade-n-grow">
      <color-box
        :x="modalX"
        :y="modalY"
        :used-colors="usedColors"
        :current-color="currentColor"
        v-if="showModal"
        @hide-modal="hideModal"
        @change-color="changeColor"
      >
      </color-box>
    </transition>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ColorBox from './ColorBox.vue';

@Component({
  components: {
    'color-box': ColorBox,
  },
})
export default class ColorButton extends Vue {
  @Prop({ default: '' }) private currentColor!: string;

  @Prop({ default: '' }) private clickable!: boolean;

  @Prop({ default: () => [] }) private usedColors!: string[];

  modalX = 0;

  modalY = 0;

  showModal = false;

  select = '';

  open(e: MouseEvent): void {
    if (e.target instanceof Element) {
      if (this.clickable && e.target.matches('.color-button') && !this.showModal) {
        this.modalX = e.pageX;
        this.modalY = e.pageY;
        this.showModal = true;
      } else if (this.clickable && e.target.matches('.overlay') && this.showModal) {
        this.hideModal(this.currentColor);
      }
    }
  }

  hideModal(select: string): void {
    if (select) {
      this.showModal = false;
      this.select = select;
    }
  }

  changeColor(color: string): void {
    this.$emit('change-color', color);
  }
}
</script>

<style lang="scss" scoped>
.color-button {
  width: 100%;
  height: 35px;
  border: 2px solid rgb(160, 160, 160);
  margin-right: 20px;
  position: relative;
}
.clickable {
  cursor: pointer;

  &.overlay {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.356) !important;
    border: none;
  }
}

.fade-n-grow {
  &-enter-active {
    opacity: 1;
    transition: all 0.3s ease-in-out;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: scale(0.2) translate(-200%, -200%);
  }
}
</style>
