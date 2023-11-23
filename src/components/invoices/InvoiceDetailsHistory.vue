<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ $t('Invoice History') }}
    </div>
    <div v-if="loading" class="py-4">
      <ui-skeleton-box
        height="21px"
        width="100%"
      />
    </div>
    <div v-else>
      <div v-for="(item, i) in history" :key="i" class="border-b">
        <div class="grid gap-2 grid-cols-[170px,1fr] items-center py-4">
          <div>
            {{ item.createdAt }}
          </div>
          <div class="break-all">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiSkeletonBox,
  },

  props: {
    loading: {
      type: Boolean,
    },
  },

  computed: {
    ...mapGetters('invoices', {
      history: 'getInvoiceDetailsHistory',
    }),
  },
});
</script>

<style lang="scss" scoped>
</style>
