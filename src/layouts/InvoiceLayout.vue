<template>
  <div class="w-full min-h-screen bg-gray-light">
    <div class="max-w-480px m-auto">
      <div class="py-2/10 px-10px">
        <slot />
        <div class="text-sm text-center px-1 py-6">
          {{ $t('Powered by') }}
          <router-link
            to="/"
            class="text-primary-500"
          >
            DV Pay
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>
