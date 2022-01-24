<template>
  <button
    class="color-button"
    :class="{ clickable: clickable }"
    :style="{ backgroundColor: currentColor, cursor: clickable ? 'pointer' : 'unset' }"
    @click="open($event, usedColors, currentColor)"
  >
    <color-box
      :x="modalX"
      :y="modalY"
      :used-colors="usedColors"
      :current-color="currentColor"
      v-if="showModal"
      @hide-modal="hideModal"
      @change-color="changeColor"
    ></color-box>
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
      if (this.clickable && e.target.matches('.color-button')) {
        this.modalX = e.offsetX;
        this.modalY = e.offsetY;
        this.showModal = true;
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
  width: 35px;
  height: 35px;
  border: 2px solid rgb(160, 160, 160);
  margin-right: 20px;
  position: relative;
}
.clickable {
  cursor: pointer;
}
</style>
