<template>
  <div class="card common-wrapper">
    <h2 class="page-title mb-6">
      {{ $t('Create a new store') }}
    </h2>
    <form
      class="form"
      @submit.prevent="createStoreHandler"
    >
      <ui-input
        required
        label-required-mark="on"
        v-model="storeName"
        type="text"
        id="createStoreName"
        :label="$t('Name')"
      />
      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
      >
        {{ $t('Create') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      storeName: '',
      currencySelect: '',
      rateSourceSelect: '',
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('dictionaries', {
      rateSources: 'rateSources',
    }),
    ...mapGetters('dictionaries', {
      fiatCurrencies: 'fiatCurrencies',
    }),
  },

  watch: {
    fiatCurrencies() {
      this.syncDataFromVuex();
    },
  },

  mounted() {
    this.syncDataFromVuex();
  },

  methods: {
    async createStoreHandler() {
      try {
        this.buttonLoading = true;
        await this.createStore({
          name: this.storeName,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Store successfully created'));
        this.$router.push({ name: 'stores' });
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    syncDataFromVuex() {
      this.currencySelect = this.fiatCurrencies[0]?.value;
      this.rateSourceSelect = this.rateSources[0]?.value;
    },

    ...mapActions('stores', ['createStore']),
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
