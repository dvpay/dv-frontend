<template>
  <div class="card common-wrapper">
    <div class="card-title mb-6">
      {{ $t('Registration management') }}
    </div>
    <ui-switcher2
      class="self-start mb-6"
      :label="$t('Enable registration users')"
      v-model="enabledRegistration"
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
import UiSwitcher2 from '@/components/ui/UiSwitcher2.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';

export default defineComponent({
  components: {
    UiSwitcher2,
    UiButtonLoading,
  },

  data() {
    return {
      enabledRegistration: false,
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('settings', ['enabledRegistrationAuth']),
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('settings', ['loadSettings', 'updateSettings']),

    async loadData() {
      await this.loadSettings();
      this.enabledRegistration = this.enabledRegistrationAuth;
    },

    async updateHandler() {
      try {
        this.buttonLoading = true;
        await this.updateSettings({
          key: 'registration_enable',
          value: this.enabledRegistration,
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
