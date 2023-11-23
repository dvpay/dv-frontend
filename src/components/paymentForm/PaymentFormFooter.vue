<template>
  <div class="footer">
    <div class="text-base text-center">
        <span class="text-md-gray">
          {{ $t('Powered by') }} DV Pay
        </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>

<style lang="scss" scoped>
.footer {
  @apply pt-4px px-20px pb-24px bg-white;
}
</style>
