<template>
  <div>
    <div class="page-title mb-6">
      <ui-skeleton-box
        v-if="skeletonLoading"
        width="100%"
        height="32px"
      />
      <span v-else>{{ serviceName }}</span>
    </div>
    <ui-skeleton-box
      v-if="skeletonLoading"
      width="100%"
      height="97px"
    />
    <div v-else>
      <monitoring-service-log-cards
        v-if="statusHistoryDetails.length"
        :data="statusHistoryDetails"
        paginationable
        :loading="loading"
        :per-page-default="perPageDefault"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      />
      <div v-else class="card text-gray-600">
        {{ $t('There are no logs') }}.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import MonitoringServiceLogCards from '@/components/monitoring/MonitoringServiceLogCards.vue';

export default defineComponent({
  components: {
    UiSkeletonBox,
    MonitoringServiceLogCards,
  },

  data() {
    return {
      skeletonLoading: false,
      currentPage: '1',
      perPageDefault: '25',
      loading: false,
    };
  },

  computed: {
    serviceId() {
      return this.$route.params.service_id;
    },

    status() {
      return this.$route.query.status;
    },

    serviceName(): string {
      return this.getStatusHistoryDetailsServiceName(this.serviceId);
    },

    ...mapState('monitoring', {
      pagination: 'statusHistoryDetailsLogsPagination',
      isStatusHistoryDetailsLoaded: 'isStatusHistoryDetailsLoaded',
    }),
    ...mapGetters('monitoring', {
      statusHistoryDetails: 'getStatusHistoryDetails',
      getStatusHistoryDetailsServiceName: 'getStatusHistoryDetailsServiceName',
    }),
  },

  async created() {
    if (!this.isStatusHistoryDetailsLoaded) {
      this.skeletonLoading = true;
    }
    if (this.statusHistoryDetails.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadStatusHistoryData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },

  unmounted() {
    this.clearStatusHistoryDetails();
    this.setIsStatusHistoryDetailsLoaded(false);
  },

  methods: {
    perPageSelectHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadStatusHistoryData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadStatusHistoryData(page, perPage);
    },

    async loadStatusHistoryData(page: string, perPage: string) {
      try {
        const params: Record<string, any> = {
          page,
          perPage,
        };

        if (this.status) {
          params.status = this.status;
        }

        await this.loadStatusHistoryDetails({ serviceId: this.serviceId, params });
        this.loading = false;
        this.skeletonLoading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.loading = false;
        this.skeletonLoading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    ...mapActions('monitoring', ['loadStatusHistoryDetails']),
    ...mapMutations('monitoring', ['clearStatusHistoryDetails', 'setIsStatusHistoryDetailsLoaded']),
  },
});
</script>

<style lang="scss" scoped>
</style>
