<template>
  <div class="payer-form-wrapper relative">
    <div class="header" :class="`header-${type}`">
      <slot name="header">
        <div class="h-32px w-full" />
      </slot>

      <div
        v-if="showClose"
        class="close-btn bg-gray-50 rounded-5px cursor-pointer max-h-24px"
        @click="$emit('close')"
      >
        <feather-icon
          class="block text-gray-400 p-5px"
          type="x"
          size="14"
        />
      </div>
    </div>

    <div class="sub-header" :class="`sub-header-${type}`">
      <slot name="sub-header" />
    </div>

    <div class="body relative">
      <div
        v-if="loading"
        class="flex-grow flex flex-col border-x-gray rounded-20px overflow-hidden"
      >
        <ui-skeleton-box
          class="flex-grow"
          width="100%"
        />
      </div>
      <slot v-else name="body" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import { PayerFormStepType } from '@/components/payerForm/types';

export default defineComponent({
  components: {
    UiSkeletonBox,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<PayerFormStepType>,
      default: 'default',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['close'],
});
</script>

<style lang="scss" scoped>
.payer-form-wrapper {
  @apply flex flex-col flex-grow rounded-16px overflow-hidden text-dark-gray;
  box-shadow: 0 -60px 70px theme('colors.secondary.100');
}

.header {
  @apply overflow-hidden flex items-center justify-between bg-secondary-800 px-24px py-16px min-h-64px font-500 gap-16px;

  .close-btn {
    &:hover {
      opacity: 0.9;
    }
  }

  &-confirmation {
    @apply bg-blue-50;

    .close-btn {
      @apply bg-gray-200;

      .vue-feather {
        @apply text-gray-600;
      }
    }
  }

  &-success {
    background-color: #5BB55B;

    .close-btn {
      @apply bg-gray-200;

      .vue-feather {
        @apply text-gray-600;
      }
    }
  }
}

.sub-header {
  @apply bg-secondary-700;
  border-top: 1px solid theme('colors.secondary.600');
  border-bottom: 4px solid theme('colors.success.250');

  &-confirmation {
    @apply bg-blue-100;
    border-top: 1px solid theme('colors.blue.20');
    border-bottom: 4px solid #3892D4;
  }

  &-success {
    @apply bg-success-600;
    border-top: 1px solid theme('colors.success.600');
    border-bottom: 4px solid #5BB55B;
  }
}

.body {
  @apply flex-grow py-10px px-0 sm:px-16px bg-gray-ligh flex flex-col gap-15px;
}
</style>
