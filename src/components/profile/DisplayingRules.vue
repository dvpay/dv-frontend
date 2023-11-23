<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ $t('Displaying') }}
    </div>
    <div class="flex flex-col gap-6">
      <change-date-format />
      <timezone-select />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChangeDateFormat from '@/components/displaying/ChangeDateFormat.vue';
import TimezoneSelect from '@/components/displaying/TimezoneSelect.vue';

export default defineComponent({
  components: {
    ChangeDateFormat,
    TimezoneSelect,
  },
});
</script>

<style lang="scss" scoped>
</style>
