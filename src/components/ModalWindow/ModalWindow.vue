<template>
  <transition :name="sideModal ? 'side-modal' : 'modal'" appear="appear">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="
        if (!timer) {
          closeModal();
        }
      "
    >
      <div
      :class="sideModal ? 'side-modal' : 'modal'">
        <div
          v-if="timer"
          class="modal-timer"
          :style="{
            width: `${timerWidth}%`,
            backgroundColor: `hsl(${110 - timerWidth}, 82%, 39%)`,
          }"
        ></div>
        <slot>Default content</slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';

@Component({
  components: {},
})
export default class ModalWindow extends Vue {
  @Prop({ default: 0 }) private timer!: number;

  @Prop({ default: false }) private sideModal!: boolean;

  currentTimer = 0;

  show = true;

  mounted(): void {
    if (this.timer) this.currentTimer = this.timer;
    if (this.currentTimer > 0) {
      const modalTimer = setInterval(() => {
        this.currentTimer -= 0.1;
        if (this.currentTimer <= 0) {
          clearInterval(modalTimer);
          this.closeModal();
        }
      }, 100);
    }
  }

  @Watch('timer') onTimerChange(): void {
    this.currentTimer = this.timer;
  }

  get timerWidth(): number {
    const percent = this.timer / 100;
    return (this.timer - this.currentTimer) / percent;
  }

  closeModal(): void {
    this.$emit('close-modalWindow');
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.356) !important;
  background-color: transparent;
  border: none;
  z-index: 50;
}

.modal {
  padding: 2rem;
  border-radius: 1rem;
  background-color: rgb(202, 202, 202);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 51;
  box-shadow: var(--any-table-shadow);
  border: 0.7rem outset;

  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: scale(0.2) translate(0, 0);
  }
}

.side-modal {
  padding: 2rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  background-color: rgb(202, 202, 202);
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  z-index: 51;
  box-shadow: var(--any-table-shadow);
  border: 0.7rem outset;
  border-left: none;
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }

  &-enter,
  &-leave-to {
    transform: translateX(-100%);
  }
}

.modal-timer {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  transition: all 0.3s;
}
</style>
