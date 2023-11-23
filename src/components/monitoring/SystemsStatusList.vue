<template>
  <div
    v-if="statusAll.length"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Systems status') }}
    </div>
    <ui-table
      :columns="tableColumns"
      :data="statusAll"
    >
      <template v-slot:cell-name="{row: item}">
        <router-link
          class="link"
          :to="{ name: 'monitoring-service', params: { service_id: item.serviceId } }"
        >
          {{ item.name }}
        </router-link>
      </template>
      <template v-slot:cell-status="{row: item}">
        <span
          :class="statusClass(item.status)"
        >
          {{ item.statusTitle }}
        </span>
      </template>
      <template v-slot:cell-message="{row: item}">
        <div class="flex justify-center">
          <span
            class="whitespace-pre-wrap max-w-400px break-all"
            :class="statusClass(item.status)"
          >
            {{ item.message }}
          </span>
        </div>
      </template>
    </ui-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  components: {
    UiTable,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'System',
          field: 'name',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-center',
        },
        {
          label: 'Message',
          field: 'message',
          textAlign: 'text-center',
        },
        {
          label: 'Last Trigger',
          field: 'lastTrigger',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    statusClass() {
      return (status: string) => {
        switch (status) {
          case 'up':
            return 'success-status';
          case 'unknown':
            return 'waiting-status';
          case 'down':
            return 'error-status';
          default:
            return 'waiting-status';
        }
      };
    },

    ...mapGetters('monitoring', {
      statusAll: 'getStatusAll',
    }),
  },

  async created() {
    if (this.statusAll.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadStatusAll();
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    ...mapActions('monitoring', ['loadStatusAll']),
  },
});
</script>

<style lang="scss" scoped>
</style>
