<template>
  <button class="btn" @click="method">
    {{ title }}
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Btn extends Vue {
  @Prop({ default: '' }) private title!: string;

  @Prop({ default: '' }) private method!: () => void;
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
    background-color: #4c6fd6;
    color: #ece0d7;

    &:hover {
      background-color: #4d72e4;
    }
  }

  &-decline {
    background-color: #4a5268;
    color: #ece0d7;
    &:hover {
      background-color: #7783a3;
    }
  }
}
</style>
