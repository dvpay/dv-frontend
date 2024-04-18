<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Root Settings') }}
    </div>
    <registration-management />
    <app-url-management />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RegistrationManagement from '@/components/settings/RegistrationManagement.vue';
import AppUrlManagement from '@/components/settings/AppUrlManagement.vue';

export default defineComponent({
  components: {
    AppUrlManagement,
    RegistrationManagement,
  },
});
</script>

<style lang="scss" scoped>
</style>
