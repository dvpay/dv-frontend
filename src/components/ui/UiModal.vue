<template>
  <teleport to="body">
    <transition name="modal">
      <div
        aria-hidden="true"
        v-show="modelValue"
        class="modal-backdrop"
        @click="closeHandler"
      >
        <div
          class="modal-wrapper"
        >
          <div
            class="modal-content"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <div class="modal-header">
              <p class="text-xl">
                <slot name="title">
                  {{ $t('Title') }}
                </slot>
              </p>

              <feather-icon
                type="x"
                size="20"
                class="icon-close"
                @click="closeHandler"
              />
            </div>
            <div
              class="modal-body"
            >
              <slot />
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <div class="flex items-center justify-end gap-4">
                  <button
                    class="button button-secondary px-3 py-2"
                    @click="closeHandler"
                  >
                    {{ $t('Close') }}
                  </button>
                  <button
                    class="button button-primary px-3 py-2"
                    :disabled="disabledConfirm"
                    @click="confirmHandler"
                  >
                    {{ $t('Confirm') }}
                  </button>
                </div>
              </slot>
            </div>
            <ui-loading :loading="loading" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiLoading from '@/components/ui/UiLoading.vue';

export default defineComponent({
  components: {
    UiLoading,
  },

  props: {
    modelValue: {
      type: Boolean,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabledConfirm: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'confirm'],

  methods: {
    closeHandler() {
      this.$emit('update:modelValue', false);
    },

    confirmHandler() {
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-backdrop {
  @apply fixed z-999 inset-0 overflow-y-auto bg-black bg-opacity-50;
}

.modal-wrapper {
  @apply flex items-start justify-center min-h-screen pt-[10%] text-center;
}

.modal-content {
  @apply bg-white rounded-md overflow-hidden shadow-md m-2 relative;
  width: var(--modal-width);
}

.modal-header {
  @apply flex justify-between items-center border-b border-gray-200 p-4;
}

.modal-body {
  @apply p-4;
}

.modal-footer {
  @apply border-t border-gray-200 p-4;
}

.icon-close {
  @apply text-gray-600 cursor-pointer hover:text-body-color;
}

.modal-leave-active,
.modal-enter-active {
  @apply transition ease-out duration-200 transform;
}

.modal-enter-to,
.modal-leave-from {
  @apply opacity-100;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0;
}
</style>
