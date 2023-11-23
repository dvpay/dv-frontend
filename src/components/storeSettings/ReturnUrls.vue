<template>
  <div class="card common-wrapper">
    <div class="text-2xl mb-6">
      {{ $t('Return Url') }}
    </div>
    <form
      class="form"
      @submit.prevent="updateReturnUrlsHandler"
    >
      <ui-input
        required
        v-model="returnUrl"
        type="url"
        id="returnUrl"
        :label="$t('Return Url')"
        pattern="https?://.+"
        :pattern-vatidate-text="$t('Please match the url format')"
      />
      <ui-input
        required
        v-model="successUrl"
        type="url"
        id="successUrl"
        :label="$t('Success Url')"
        pattern="https?://.+"
        :pattern-vatidate-text="$t('Please match the url format')"
      />
      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
      >
        {{ $t('Save') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      returnUrl: '',
      successUrl: '',
      buttonLoading: false,
    };
  },

  computed: {
    storeIdFromUrl() {
      return this.$route.params.store_id;
    },

    ...mapState('stores', {
      returnUrls: 'returnUrls',
    }),
  },

  created() {
    this.getReturnUrls();
    this.syncDataFromVuex();
  },

  watch: {
    returnUrls() {
      this.syncDataFromVuex();
    },
  },

  methods: {
    getReturnUrls() {
      this.loadReturnUrls(this.storeIdFromUrl);
    },

    async updateReturnUrlsHandler() {
      try {
        this.buttonLoading = true;
        await this.updateReturnUrls({
          storeId: this.storeIdFromUrl,
          payload: {
            returnUrl: this.returnUrl,
            successUrl: this.successUrl,
          },
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Return url successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    syncDataFromVuex() {
      this.returnUrl = this.returnUrls.return_url;
      this.successUrl = this.returnUrls.success_url;
    },

    ...mapActions('stores', ['loadReturnUrls', 'updateReturnUrls']),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-6;
}
.form-group {
  @apply flex flex-col gap-2;
}
</style>
