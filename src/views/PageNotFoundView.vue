<template>
  <div class="flex justify-center absolute w-full top-1/5 p-2">
    <div class="flex flex-col gap-8">
      <div class="text-center font-600 text-gray-600">
        <div class="text-4xl mb-2">404</div>
        <div class="text-xl">
          {{ $t('Page not found') }}
        </div>
      </div>
      <img src="@/assets/img/nonono.gif" alt="404">
      <div class="flex justify-center">
        <router-link
          to="/"
          class="button button-primary px-4 py-2 flex"
        >
          {{ $t('Back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>
