<template>
  <div class="card common-wrapper">
    <div class="text-2xl mb-6">
      {{ $t('Rates') }}
    </div>
    <form
      class="form"
      @submit.prevent="updateRateSettings"
    >
      <div class="form-group">
        <label
          for="ratesSelect"
          class="self-start"
        >
          {{ $t('Preferred Price Source') }}
        </label>
        <ui-select
          class="h-40px"
          v-if="rateSources.length && rateSource"
          id="ratesSelect"
          v-model="rateSourceSelect"
          :options="rateSources"
        />
      </div>
      <div class="form-group">
        <label
          for="ratesSelect"
          class="self-start"
        >
          {{ $t('Modify Rate Scale') }} %
        </label>
        <ui-select
          class="h-40px"
          v-if="rateSource"
          id="ratesSelect"
          v-model="rateScaleSelect"
          :options="rateScaleOptions"
        />
      </div>
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
import UiSelect from '@/components/ui/UiSelect.vue';

export default defineComponent({
  components: {
    UiButtonLoading,
    UiSelect,
  },

  data() {
    return {
      rateSourceSelect: '',
      rateScaleSelect: '',
      rateScaleOptions: [
        {
          title: this.$t('Do not modify'),
          value: '0',
        },
        {
          title: '-0.5 %',
          value: '0.5',
        },
        {
          title: '-1 %',
          value: '1',
        },
        {
          title: '-2 %',
          value: '2',
        },
        {
          title: '-3 %',
          value: '3',
        },
      ],
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('dictionaries', {
      rateSources: 'rateSources',
    }),
    ...mapState('rates', {
      rateSource: 'rateSource',
      rateScale: 'rateScale',
    }),
  },

  watch: {
    rateSource() {
      this.syncDataFromVuex();
    },
  },

  async created() {
    if (this.rateSource) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadRateSource();
    this.$store.commit('app/setProgressBar', 'stop');
  },

  mounted() {
    this.syncDataFromVuex();
  },

  methods: {
    syncDataFromVuex() {
      this.rateSourceSelect = this.rateSource;
      this.rateScaleSelect = this.rateScale;
    },

    async updateRateSettings() {
      try {
        this.buttonLoading = true;
        await this.updateRateSource({
          rateSource: this.rateSourceSelect,
          rateScale: this.rateScaleSelect,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Rate source successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    ...mapActions('rates', ['loadRateSource', 'updateRateSource']),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-10;
}
.form-group {
  @apply flex flex-col gap-2;
}
</style>
