<template>
  <div class="card common-wrapper">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3 gap-4">
        <div class="text-2xl">
          {{ $t('Webhooks') }}
        </div>
        <button
          class="button button-primary px-4 py-2 flex items-center gap-1"
          :disabled="loading"
          @click="createWebhookHandler"
        >
          <feather-icon type="plus" size="16" stroke-width="3" />
          <span>{{ $t('Create Webhook') }}</span>
        </button>
      </div>
      <div>
        {{ $t('Webhooks allow to send HTTP events related to your store to another server') }}
      </div>
    </div>

    <div
      v-if="webhookList.length"
      class="relative"
    >
      <ui-table
        :columns="tableColumns"
        :data="webhookList"
      >
        <template v-slot:cell-actions="{row: item}">
          <div class="flex justify-end gap-4">
            <button
              class="button button-secondary py-1 px-2"
              @click="testWebhookHandler(item.id)"
            >
              {{ $t('Test') }}
            </button>
            <button
              class="button button-primary py-1 px-2"
              @click="modifyWebhookHandler(item.id)"
            >
              {{ $t('Modify') }}
            </button>
            <button
              class="button button-error py-1 px-2"
              @click="deleteWebhookHandler(item.id)"
            >
              {{ $t('Delete') }}
            </button>
          </div>
        </template>
      </ui-table>
      <ui-loading :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  components: {
    UiLoading,
    UiTable,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Url',
          field: 'url',
          textAlign: 'text-left',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      loading: false,
    };
  },

  computed: {
    storeIdFromUrl() {
      return this.$route.params.store_id;
    },

    ...mapState('stores', ['webhookList']),
  },

  created() {
    this.loadWebhooks(this.storeIdFromUrl);
  },

  methods: {
    createWebhookHandler() {
      this.$router.push(
        { name: 'store-settings-webhook-item', params: { webhook_id: 'new' } },
      );
    },

    testWebhookHandler(webhookId: string) {
      this.$router.push(
        { name: 'store-settings-webhook-test', params: { webhook_id: webhookId } },
      );
    },

    modifyWebhookHandler(webhookId: string) {
      this.$router.push(
        { name: 'store-settings-webhook-item', params: { webhook_id: webhookId } },
      );
    },

    async deleteWebhookHandler(webhookId: string) {
      this.loading = true;
      try {
        await this.deleteWebhook({
          storeId: this.storeIdFromUrl,
          webhookId,
        });
        await this.loadWebhooks(this.storeIdFromUrl);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    ...mapActions('stores', ['loadWebhooks', 'deleteWebhook']),
  },
});
</script>

<style lang="scss" scoped>
</style>
