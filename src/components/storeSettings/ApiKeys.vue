<template>
  <div class="card common-wrapper relative">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <div class="text-2xl">
          {{ $t('Api Keys') }}
        </div>
        <button
          class="button button-primary px-4 py-2 flex items-center gap-1"
          :disabled="loading"
          @click="createApiKeyHandler"
        >
          <feather-icon type="plus" size="16" stroke-width="3" />
          <span>{{ $t('Create Api Key') }}</span>
        </button>
      </div>
      <div>
        {{ $t('Use the API by including the following HTTP Header in your requests') }}
      </div>
    </div>

    <div
      v-if="apiKeyList.length"
    >
      <ui-table
        :columns="tableColumns"
        :data="apiKeyList"
        :loading="loading"
      >
        <template v-slot:cell-enabled="{row: item}">
          <ui-switcher
            :checked="item.enabled"
            @switched="switchHandler(item.id, item.enabled)"
          />
        </template>
        <template v-slot:cell-apikey="{row: item}">
          <span class="break-all flex items-center gap-2">
            {{ item.key }}
          </span>
        </template>
        <template v-slot:cell-actions="{row: item}">
          <div class="flex justify-end items-center gap-6">
            <ui-copy-to-clipboard :text-to-copy="item.key" />
            <button
              class="button button-error py-1 px-2"
              @click="deleteApiKeyHandler(item.id)"
            >
              {{ $t('Delete') }}
            </button>
          </div>
        </template>
      </ui-table>
    </div>
    <div v-else>
      <ui-loading :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  components: {
    UiSwitcher,
    UiLoading,
    UiCopyToClipboard,
    UiTable,
  },

  data() {
    return {
      checked: false,
      tableColumns: [
        {
          label: 'Enabled',
          field: 'enabled',
          textAlign: 'text-left',
        },
        {
          label: 'Api Key',
          field: 'apikey',
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

    ...mapState('stores', ['apiKeyList']),
  },

  created() {
    this.loadApiKeys(this.storeIdFromUrl);
  },

  methods: {
    async createApiKeyHandler() {
      this.loading = true;
      try {
        await this.createApiKey(this.storeIdFromUrl);
        await this.loadApiKeys(this.storeIdFromUrl);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    async switchHandler(apiKeyId: string, enabled: boolean) {
      this.loading = true;
      try {
        await this.updateApiKey({
          storeId: this.storeIdFromUrl,
          apiKeyId,
          payload: {
            enabled: !enabled,
          },
        });
        await this.loadApiKeys(this.storeIdFromUrl);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    async deleteApiKeyHandler(apiKeyId: string) {
      this.loading = true;
      try {
        await this.deleteApiKey({
          storeId: this.storeIdFromUrl,
          apiKeyId,
        });
        await this.loadApiKeys(this.storeIdFromUrl);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    ...mapActions('stores', [
      'createApiKey',
      'loadApiKeys',
      'updateApiKey',
      'deleteApiKey',
    ]),
  },
});
</script>

<style lang="scss" scoped>
</style>
