<template>
  <button
    v-html="title"
    class="btn"
    @click="
      method();
      playButtonSound();
    "
  >
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import playSound from '../../utils/sounds/index';

@Component({
  components: {},
})
export default class Btn extends Vue {
  @Prop({ default: '' }) private title!: string;

  @Prop({ default: '' }) private method!: () => void;

  playButtonSound = (): void => {
    playSound('button');
  };
}
</script>

<style lang="scss" scoped>
.btn {
  display: block;
  padding: 10px 20px;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  outline: none;

  &-accept {
    background-color: #00912b;
    color: #ece0d7;

    &:hover {
      background-color: #4d72e4;
    }
  }

  &-decline {
    background-color: #a00101;
    color: #ece0d7;
    &:hover {
      background-color: #7783a3;
    }
  }
}
</style>
