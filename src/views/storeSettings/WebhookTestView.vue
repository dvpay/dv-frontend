<template>
  <div>
    <div class="card common-wrapper mb-10">
      <div class="text-2xl mb-6">
        {{ $t('Send a test event to a webhook endpoint') }}
      </div>
      <form
        class="form"
        @submit.prevent="sendTestWebhookHandler"
      >
        <ui-input
          required
          label-required-mark="on"
          v-model="orderId"
          type="text"
          id="orderId"
          :label="$t('Order Id')"
        />
        <div class="flex flex-col gap-2">
          <label
            for="webhookTypes"
            class="self-start"
          >
            {{ $t('Event type') }}
          </label>
          <ui-select
            id="webhookTypes"
            class="max-w-280px h-40px"
            v-model="webhookTypeSelected"
            :options="webhookTypes"
          />
        </div>
        <ui-button-loading
          class="button button-primary py-2 px-4 self-start mt-4"
          type="submit"
          :loading="buttonLoading"
        >
          {{ $t('Send test webhook') }}
        </ui-button-loading>
      </form>
    </div>
    <div
      v-if="testWebhookResponse.status"
      class="webhook-response common-wrapper"
    >
      <div
        class="text-xl font-600 px-2 py-1"
        :class="[
          testWebhookResponse.status >= 200 && testWebhookResponse.status < 300
          ? 'bg-emerald-100'
          : 'bg-danger-200'
        ]"
      >
        {{ $t('webhook response') }}
      </div>
      <div class="flex items-center gap-2 px-2 py-1">
        <span class="font-600">
          {{ $t('status') }}:
        </span>
        <span class="text-cyan-500">
          {{ testWebhookResponse.status }}
        </span>
      </div>
      <pre
        v-html="testWebhookResponse.message"
        class="pre"
      ></pre>
      <button
        class="close"
        @click="removeWebhookResponseBlock"
      >
        <feather-icon type="x" size="18" stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiSelect,
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      orderId: '',
      webhookType: '',
      buttonLoading: false,
    };
  },

  computed: {
    storeIdFromUrl() {
      return this.$route.params.store_id;
    },

    webhookTypeSelected: {
      get(): string {
        return this.webhookType
          ? this.webhookType
          : this.webhookTypes[0]?.value;
      },

      set(value) {
        this.webhookType = value;
      },
    },

    webhookId() {
      return this.$route.params.webhook_id;
    },

    ...mapState('dictionaries', ['webhookTypes']),
    ...mapState('stores', ['testWebhookResponse']),
  },

  unmounted() {
    this.removeWebhookResponseBlock();
  },

  methods: {
    async sendTestWebhookHandler() {
      try {
        this.buttonLoading = true;
        await this.sendTestWebhook({
          storeId: this.storeIdFromUrl,
          webhookId: this.webhookId,
          payload: {
            eventType: this.webhookTypeSelected,
            orderId: this.orderId,
          },
        });
        this.buttonLoading = false;
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    removeWebhookResponseBlock() {
      this.setTestWebhookResponse('{}');
    },

    ...mapMutations('stores', ['setTestWebhookResponse']),
    ...mapActions('stores', ['sendTestWebhook']),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-4;
}

.webhook-response {
  @apply relative flex flex-col gap-2 bg-white border rounded shadow-basic;
}

.pre {
  @apply tab-2 p-2 mx-2 mb-2 border rounded-sm shadow-sm;
  @apply whitespace-pre-wrap break-all;
}

.close {
  @apply absolute w-24px h-24px flex items-center justify-center cursor-pointer;
  @apply bg-gray-300 hover:opacity-80 rounded-1/2 -top-10px -right-10px;
}
</style>
