<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Monitoring') }}
    </div>
    <div class="flex flex-col gap-6">
      <server-monitoring-card />
      <systems-status-list />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SystemsStatusList from '@/components/monitoring/SystemsStatusList.vue';
import ServerMonitoringCard from '@/components/monitoring/ServerMonitoringCard.vue';

export default defineComponent({
  components: {
    SystemsStatusList,
    ServerMonitoringCard,
  },
});
</script>

<style lang="scss" scoped>
</style>
