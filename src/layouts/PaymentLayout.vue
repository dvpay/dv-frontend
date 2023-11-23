<template>
  <div class="w-full min-h-screen bg-gray-light">
    <div class="max-w-520px m-auto">
      <div class="py-2/10 px-10px">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>
