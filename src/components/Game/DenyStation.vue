<template>
  <div class="content">
    <h3>Нельзя построить больше станций</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class DenyStation extends Vue {

}

</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}
</style>
