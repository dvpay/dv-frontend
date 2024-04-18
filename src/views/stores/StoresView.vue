<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Your Projects') }}
        </div>
        <router-link
          class="button button-primary px-6 py-3 flex items-center gap-1"
          :to="{ name: 'store-create' }"
        >
          <feather-icon type="plus" size="16" stroke-width="3" />
          <span>{{ $t('Create Store') }}</span>
        </router-link>
      </div>
    </div>
    <div
      v-if="storeList.length"
      class="card"
    >
      <ui-table
        :columns="tableColumns"
        :data="storeList"
      >
        <template v-slot:cell-actions="{row: item}">
          <router-link
            class="cursor-pointer text-primary-500 hover:text-primary-600"
            :to="{
            name: 'store-settings',
            params: {
              store_id: item.id
            }
          }"
          >
            {{ $t('Settings') }}
          </router-link>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  components: {
    UiTable,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Created At',
          field: 'createdAt',
          textAlign: 'text-center',
        },
        {
          label: 'Name',
          field: 'name',
          textAlign: 'text-left',
        },
        {
          label: 'Payments count',
          field: 'invoicesCount',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    ...mapGetters('stores', {
      storeList: 'getStoreList',
    }),
  },

  async created() {
    this.setIsStoreListLoading(true);
    if (this.storeList.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadStores();
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    ...mapMutations('stores', ['setIsStoreListLoading']),
    ...mapActions('stores', ['loadStores']),
  },
});
</script>
