<template>
  <div class="relative payer-form-loader" :class="`payer-form-loader-${type}`">
    <div class="center">
      <slot />
    </div>

    <template v-if="['default', 'confirmation'].includes(type)">
      <ICutCircle class="cutCircle" />

      <img class="bg" src="@/assets/img/invoice-awaiting.png" alt="" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PayerFormStepType } from '@/components/payerForm/types';

import ICutCircle from '@/components/icon/ICutCircle.vue';

export default defineComponent({
  props: {
    type: {
      type: String as PropType<PayerFormStepType>,
      default: 'default',
    },
  },

  components: { ICutCircle },
});
</script>

<style lang="scss" scoped>
.payer-form-loader {
  aspect-ratio: 1/1;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom center, 50%, 50%;

  &-default,
  &-confirmation {
    @apply bg-white rounded-full;
    box-shadow: 0 0 16px 0 var(--secondary-100);
    background: white;

    .cutCircle {
      position: absolute;
      color: #2089d5;
      opacity: 1;
      left: 50%;
      top: 50%;
      width: 86%;
      height: 86%;
      translate: -50% -50%;
    }

    .bg {
      z-index: 1;
      max-width: 100%;
      position: absolute;
      opacity: 1;
      left: 50%;
      top: 50%;
      width: 72%;
      height: 72%;
      translate: -50% -50%;
      animation: rotate 3.5s linear infinite;
      pointer-events: none;
    }

    .center {
      width: 100%;
    }
  }

  &-default {
    background-size: 72%;
    .cutCircle {
      animation: pulse 3.5s ease-in-out infinite;
    }
  }

  &-confirmation {
    background-size: 77%;
    .cutCircle {
      animation: pulse 3.5s ease-in-out infinite;
    }
  }

  &-success {
    background-image: url('@/assets/img/invoice-success.svg');
    background-size: contain;

    .center {
      @apply mt-24px lg:mt-32px;
    }
  }

  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  @keyframes pulse {
    0% {
      scale: 1;
      opacity: 1;
    }
    50% {
      scale: 1.2;
      opacity: 0;
    }
    100% {
      scale: 1;
      // rotate: 1turn;
      opacity: 0.8;
    }
  }

  @keyframes rotate {
    to {
      rotate: 1turn;
    }
  }
}
</style>
