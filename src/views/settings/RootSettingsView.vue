<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Root Settings') }}
    </div>
    <registration-management />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RegistrationManagement from '@/components/settings/RegistrationManagement.vue';

export default defineComponent({
  components: {
    RegistrationManagement,
  },
});
</script>

<style lang="scss" scoped>
</style>
