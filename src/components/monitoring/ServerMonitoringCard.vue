<template>
  <div class="grid grid-cols-[1.5fr,1.5fr,1fr] <tablet:grid-cols-[1fr] gap-6">
    <div class="card">
      <div class="card-title mb-8">
        {{ $t('Disk Spaces') }}
      </div>
      <div class="flex items-center gap-6">
        <ui-diagram
          :percent="diskUsagePercent"
        >
          <div class="flex flex-col">
            <span>{{ $t('Disk Usage') }}</span>
            <span>{{ diskUsagePercent }}%</span>
          </div>
        </ui-diagram>
        <div class="flex flex-col gap-6">
          <!--          <div class="flex item-center gap-2">-->
          <!--            <span class="font-600">{{ $t('total_memory') }}:</span>-->
          <!--            <span>{{ disk.diskTotal }}</span>-->
          <!--          </div>-->
          <div class="flex item-center gap-2">
            <span class="font-600">{{ $t('free_memory') }}:</span>
            <span>{{ disk.diskFree }}({{ disk.diskSpaceFreePercent }}%)</span>
            <span>{{ $t('From') }} {{ disk.diskTotal }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title mb-8">
        {{ $t('Queues') }}
      </div>
      <table
        v-if="queues.length"
        class="w-full"
      >
        <tbody>
        <template v-for="(column, i) in tableColumns" :key="i">
          <tr class="border-b last:border-b-0" :class="queues[i].size > 200 ? 'text-red-400' : ''">
            <th class="py-2 pr-3 font-500 w-240px" :class="column.textAlign">
              {{ $t(column.label) }}
            </th>
            <td class="break-all py-2">
              <div>{{ queues[i].size }}
                <span v-if="queues[i].size > 200" class="danger-badge">Alert</span>
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
    <notifications-targets />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiDiagram from '@/components/ui/UiDiagram.vue';
import NotificationsTargets from '@/components/notifications/NotificationsTargets.vue';

export default defineComponent({
  components: {
    NotificationsTargets,
    UiDiagram,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Default',
          field: 'default',
          textAlign: 'text-left',
        },
        {
          label: 'Transfer',
          field: 'transfer',
          textAlign: 'text-left',
        },
        {
          label: 'Monitor',
          field: 'monitor',
          textAlign: 'text-left',
        },
        {
          label: 'Notifications',
          field: 'notifications',
          textAlign: 'text-left',
        },
      ],
    };
  },

  computed: {
    ...mapState('monitoring', {
      disk: 'serverMonitoringDisk',
      queues: 'serverMonitoringQueues',
    }),

    diskUsagePercent(): number {
      return this.disk.diskSpaceFreePercent
        ? 100 - this.disk.diskSpaceFreePercent
        : 0;
    },
  },

  created() {
    this.loadServerMonitoring();
  },

  methods: {
    ...mapActions('monitoring', ['loadServerMonitoring']),
  },
});
</script>

<style lang="scss" scoped>
.danger-badge {
  @apply inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10
}
</style>
