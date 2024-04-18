<template>
  <div class="card common-wrapper">
    <div class="card-title mb-6">
      {{ $t('App URL management') }}
    </div>
    <ui-input
      required
      v-model="newAppUrl"
      type="url"
      id="appUrl"
      :label="$t('App Url')"
      pattern="https?://.+"
      :pattern-vatidate-text="$t('Please match the url format')"
      class="self-start mb-6"
    />
    <ui-button-loading
      class="button button-primary px-4 py-2"
      :loading="buttonLoading"
      @click="updateHandler"
    >
      {{ $t('Save') }}
    </ui-button-loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiInput,
    UiButtonLoading,
  },

  data() {
    return {
      newAppUrl: '',
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('settings', ['appUrl']),
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('settings', ['loadSettings', 'updateSettings']),

    async loadData() {
      await this.loadSettings();
      this.newAppUrl = this.appUrl;
    },

    async updateHandler() {
      try {
        this.buttonLoading = true;
        await this.updateSettings({
          key: 'app_url',
          value: this.newAppUrl,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Settings successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
