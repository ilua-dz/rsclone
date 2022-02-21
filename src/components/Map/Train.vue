<template>
  <use
    xlink:href="assets/map/train.svg#train"
    :x="train.x"
    :y="train.y"
    :transform="train.transform"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import railwayInterface from '../interface/railway';

@Component({})
export default class Train extends Vue {
  @Prop({ default: [] }) private train!: railwayInterface['train'];
}
</script>
