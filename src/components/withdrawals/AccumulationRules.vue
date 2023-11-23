<template>
  <div class="card">
    <div class="card-title mb-6">
      {{ $t('Accumulation Rules') }}
    </div>
    <accumulation-rules-edit
      v-if="isEdit"
      @showHideAccumulationRulesForm="showHideAccumulationRulesForm"
    />
    <accumulation-rules-view
      v-else
      @showHideAccumulationRulesForm="showHideAccumulationRulesForm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccumulationRulesView from '@/components/withdrawals/AccumulationRulesView.vue';
import AccumulationRulesEdit from '@/components/withdrawals/AccumulationRulesEdit.vue';

export default defineComponent({
  components: {
    AccumulationRulesView,
    AccumulationRulesEdit,
  },

  data() {
    return {
      isEdit: false,
    };
  },

  methods: {
    showHideAccumulationRulesForm() {
      this.isEdit = !this.isEdit;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
