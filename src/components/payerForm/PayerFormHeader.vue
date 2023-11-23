<template>
  <div class="relative z-11">
    <div class="header">
      <div v-if="payer.store.name" class="text-26px text-white">
        {{ payer.store.name }}
      </div>
      <div v-else class="h-26px w-full"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  data() {
    return {
      isShowDropdownMenu: false,
    };
  },

  computed: {
    ...mapState('payer', {
      payer: 'payer',
    }),
  },
});
</script>

<style lang="scss" scoped>
.header {
  @apply px-20px py-15px flex items-center justify-between bg-dark-gray;
}
</style>
