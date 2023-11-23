<template>
  <div class="card common-wrapper">
    <div class="text-2xl mb-6">
      {{ $t('Webhook Settings') }}
    </div>
    <form
      class="form"
      @submit.prevent="updateWebhookHandler"
    >
      <div class="form-inputs">
        <ui-input
          required
          label-required-mark="on"
          v-model="payloadUrl"
          type="url"
          id="payloadUrl"
          :label="$t('Payload URL')"
          pattern="https?://.+"
          :pattern-vatidate-text="$t('Please match the url format')"
        />
        <ui-input
          disabled
          v-model="secretBase"
          type="text"
          id="secretBase"
          :label="$t('Secret')"
        />
      </div>
      <div class="flex items-center gap-4">
        <ui-switcher
          :checked="enabled"
          @switched="switchEnabledHandler"
        />
        <span>
          {{ $t('Enabled') }}
        </span>
      </div>
      <div>
        <div class="text-2xl mb-6">
          {{ $t('Events') }}
        </div>
        <div class="flex flex-col gap-4">
          <div>
            {{ $t('Which events would you like to trigger this webhook?') }}
          </div>
          <div
            v-if="webhookTypes.length"
            class="flex flex-col gap-4"
          >
            <ui-checkbox
              v-for="(item, i) in eventsSelected"
              class="self-start"
              :key="i"
              :id="item.value"
              :label="item.title"
              v-model="item.checked"
            />
          </div>
        </div>
      </div>
      <ui-button-loading
        v-if="webhookId"
        :loading="buttonLoading"
        class="button button-primary px-4 py-2 self-start"
      >
        <span v-if="webhookId === 'new'">
          {{ $t('Add webhook') }}
        </span>
        <span v-else>
          {{ $t('Update webhook') }}
        </span>
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import { WebhookResponse } from '@/services/StoreService/types';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

interface WebhookTypes {
  title: string;
  value: string;
  checked: boolean;
}

export default defineComponent({
  components: {
    UiSwitcher,
    UiCheckbox,
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      webhookId: '',
      payloadUrl: '',
      secretBase: '',
      enabled: true,
      eventsSelected: [],
      buttonLoading: false,
    };
  },

  computed: {
    storeIdFromUrl() {
      return this.$route.params.store_id;
    },

    ...mapState('dictionaries', {
      webhookTypes: 'webhookTypes',
    }),
    ...mapState('stores', ['webhookList']),
  },

  watch: {
    webhookList() {
      this.syncDataFromVuex();
    },

    webhookTypes() {
      this.syncDataFromVuex();
    },
  },

  created() {
    this.loadWebhooksData();
    this.syncDataFromVuex();
  },

  methods: {
    switchEnabledHandler() {
      this.enabled = !this.enabled;
    },

    loadWebhooksData() {
      if (this.$route.params.webhook_id !== 'new') {
        this.loadWebhooks(this.storeIdFromUrl);
      }
    },

    async updateWebhookHandler() {
      const selectedEventsArray = this.eventsSelected
        .filter((item: WebhookTypes) => item.checked)
        .map((item: WebhookTypes) => item.value);

      if (this.webhookId === 'new') {
        try {
          this.buttonLoading = true;
          await this.createWebhook({
            storeId: this.storeIdFromUrl,
            payload: {
              url: this.payloadUrl,
              secret: this.secretBase,
              enabled: this.enabled,
              events: selectedEventsArray,
            },
          });
          this.buttonLoading = false;
          this.$router.push({ name: 'store-settings-advanced' });
          this.$toast.success(this.$t('Webhook successfully created'));
        } catch (e) {
          this.buttonLoading = false;
        }
      } else {
        try {
          this.buttonLoading = true;
          await this.updateWebhook({
            storeId: this.storeIdFromUrl,
            webhookId: this.webhookId,
            payload: {
              url: this.payloadUrl,
              secret: this.secretBase,
              enabled: this.enabled,
              events: selectedEventsArray,
            },
          });
          this.buttonLoading = false;
          this.$toast.success(this.$t('Webhook successfully updated'));
        } catch (e) {
          this.buttonLoading = false;
        }
      }
    },

    async syncDataFromVuex() {
      const webhookId = this.$route.params.webhook_id;
      this.webhookId = webhookId as string;
      if (webhookId === 'new') {
        this.payloadUrl = '';
        this.secretBase = await this.generateSecret();
        this.enabled = true;
        this.eventsSelected = this.webhookTypes.map((item: WebhookTypes, index: number) => {
          return {
            title: item.title,
            value: item.value,
            checked: index === 0,
          };
        });
      } else {
        const webhook = this.webhookList.filter((item: WebhookResponse) => item.id === webhookId);
        if (webhook.length) {
          this.payloadUrl = webhook[0].url;
          this.secretBase = webhook[0].secret;
          this.enabled = !!webhook[0].enabled;
          this.eventsSelected = this.webhookTypes.map((item: WebhookTypes) => {
            return {
              title: item.title,
              value: item.value,
              checked: !!webhook[0].events.find((elem: string) => elem === item.value),
            };
          });
        }
      }
    },

    ...mapActions('stores', [
      'loadWebhooks',
      'generateSecret',
      'createWebhook',
      'updateWebhook',
    ]),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-10;
}
.form-inputs {
  @apply flex flex-col gap-6;
}
.form-group {
  @apply flex flex-col gap-2;
}
</style>
