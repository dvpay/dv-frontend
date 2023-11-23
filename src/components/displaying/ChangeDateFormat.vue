<template>
  <div class="flex flex-col gap-2">
    <label
      for="dateFormat"
      class="self-start"
    >
      {{ $t('Date and time format') }}
    </label>
    <ui-select
      class="h-40px w-240px"
      id="dateFormat"
      v-model="dateFormatSelected"
      :options="dateFormatOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';

export default defineComponent({
  components: {
    UiSelect,
  },

  computed: {
    dateFormatSelected: {
      get(): string {
        return this.dateFormat;
      },

      set(value: string) {
        this.setDateFormat(value);
      },
    },

    ...mapState('app', {
      dateFormat: 'dateFormat',
      dateFormatOptions: 'dateFormatOptions',
    }),
  },

  methods: {
    ...mapMutations('app', ['setDateFormat']),
  },
});
</script>

<style lang="scss" scoped>
</style>
