<template>
  <div class="bg-s-gray">
    <div class="title mb-4">
      {{ $t('How to pay') }}
    </div>
    <div class="flex flex-col gap-10px">
      <div class="item">
        <div class="item-title">
          1. {{ $t('how_to_pay_1_title') }}
        </div>
        <div class="item-text">
          {{ $t('how_to_pay_1_text') }}
        </div>
      </div>
      <div class="item">
        <div class="item-title">
          2. {{ $t('how_to_pay_2_title') }}
        </div>
        <div class="item-text">
          {{ $t('how_to_pay_2_text') }}
        </div>
      </div>
      <div class="item">
        <div class="item-title">
          3. {{ $t('how_to_pay_3_title') }}
        </div>
        <div class="item-text">
          {{ $t('how_to_pay_3_text') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>

<style lang="scss" scoped>
.title {
  @apply text-center font-600 text-22px;
}

.item {
  background: #FFFFFF;
  border: 1px solid #E4E6F1;
  box-shadow: 0 12px 20px rgba(68, 75, 85, 0.05);
  border-radius: 20px;
  padding: 12px 16px;
  line-height: 24px;
}

.item-title {
  color: #3F4048;
  font-weight: 600;
  padding-bottom: 6px;
  font-size: 16px;
}

.item-text {
  color: #62626F;
}
</style>
