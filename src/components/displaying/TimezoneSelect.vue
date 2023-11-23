<template>
  <div class="relative">
    <div class="mb-2">
      {{ $t('Select Timezone') }}
    </div>
    <ui-search-dropdown-select
      :selected="selectedLocationComp"
      :options="searchedLocations"
      @change="selectHandler"
      @search="searchHandler"
      @focusSelect="focusHandler"
    />
    <ui-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import UiSearchDropdownSelect from '@/components/ui/UiSearchDropdownSelect.vue';
import { SelectOptionType } from '@/components/types';
import UiLoading from '@/components/ui/UiLoading.vue';

export default defineComponent({
  components: {
    UiSearchDropdownSelect,
    UiLoading,
  },

  data() {
    return {
      locationOptions: [] as SelectOptionType[],
      search: '',
      loading: false,
    };
  },

  computed: {
    searchedLocations(): SelectOptionType[] {
      return this.locationOptions
        .filter((item) => item.value.toLowerCase().includes(this.search.toLowerCase()));
    },

    selectedLocationComp: {
      get(): string {
        return this.selectedLocation ? this.selectedLocation : this.userInfo.location;
      },

      set(value: string) {
        this.setSelectedLocation(value);
      },
    },

    ...mapState('user', {
      userInfo: 'userInfo',
      selectedLocation: 'selectedLocation',
    }),
    ...mapState('dictionaries', {
      locations: 'locations',
    }),
  },

  mounted() {
    this.syncDataFromVuex();
  },

  watch: {
    locations() {
      this.syncDataFromVuex();
    },
  },

  methods: {
    selectHandler(value: string) {
      this.selectedLocationComp = value;
      this.updateLocale();
    },

    searchHandler(value: string) {
      this.search = value;
    },

    focusHandler() {
      this.search = '';
    },

    syncDataFromVuex() {
      this.locationOptions = this.locations.map((item: string) => ({
        title: item,
        value: item,
      }));
    },

    async updateLocale() {
      try {
        this.loading = true;
        await this.updateUserInfo({
          location: this.selectedLocation,
        });
        this.loading = false;
        this.$toast.success(this.$t('Timezone updated'));
      } catch (e) {
        this.loading = false;
      }
    },

    ...mapMutations('user', ['setSelectedLocation']),
    ...mapActions('user', ['updateUserInfo']),
  },
});
</script>

<style lang="scss" scoped>
</style>
