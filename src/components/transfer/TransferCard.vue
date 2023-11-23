<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ title }}
    </div>
    <div>
      <slot/>
    </div>
    <ul>
      <div v-if="!transfers?.length">
        {{ emptyError }}
      </div>
      <ui-table v-else
                :columns="columns"
                :data="transfers"
      >
        <template v-slot:cell-createdAt="{row: item}">
          <p>{{ formatDate(item.created_at) }}</p>
          <p>ID: {{ item.uuid }}</p>
        </template>
        <template v-slot:cell-type="{row: item}">
          <p>{{ $t('transferDesc') }}</p>
        </template>
        <template v-slot:cell-detail="{row: item}">
          <p>{{ $t('From transfer') }}: {{ item.address_from }}</p>
          <p>{{ $t('To transfer') }}: {{ item.address_to }}</p>
          <p>{{ $t('Amount') }}: {{ numberFormatter(item.amount_usd) }} USDT</p>
        </template>
        <template v-slot:cell-status="{row: item}">
          <p>{{ $t(item.status) }}</p>
        </template>
      </ui-table>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import UiTable from '@/components/ui/UiTable.vue';
import { formatDate, numberFormatter } from '@/utils';

export default defineComponent({
  name: 'TransferCard',
  methods: { formatDate, numberFormatter },
  components: { UiTable },
  props: {
    title: {
      type: String,
    },
    emptyError: {
      type: String,
    },
    transfers: {
      type: Array,
    },
  },
  data() {
    return {
      columns: [
        {
          label: 'Time',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Type',
          field: 'type',
          textAlign: 'text-left',
        },
        {
          label: 'Detail',
          field: 'detail',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-left',
        },
      ],
    };
  },
});

</script>


<style scoped lang="scss">

</style>
