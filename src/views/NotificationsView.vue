<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Notifications') }}
    </div>
    <div class="flex flex-col gap-6">
      <notifications-targets />
      <notifications-types />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotificationsTargets from '@/components/notifications/NotificationsTargets.vue';
import NotificationsTypes from '@/components/notifications/NotificationsTypes.vue';

export default defineComponent({
  components: {
    NotificationsTargets,
    NotificationsTypes,
  },
});
</script>

<style lang="scss" scoped>
</style>
