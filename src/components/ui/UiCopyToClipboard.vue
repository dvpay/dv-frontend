<template>
  <div
    aria-hidden="true"
    class="copy"
    :class="{'hoverhint': hoverHint}"
    :data-tooltip="hoverText"
    @click="clickHandler"
  >
    <feather-icon
      v-if="check"
      type="check"
      :size="size"
    />
    <feather-icon
      v-else
      type="copy"
      :size="size"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    textToCopy: {
      type: String,
      required: true,
    },

    hoverHint: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: '16',
    },
  },

  emits: ['copied'],

  data() {
    return {
      timer: 0 as unknown as ReturnType<typeof setTimeout>,
      check: false,
      hoverText: 'Copy to clipboard',
    };
  },

  methods: {
    clickHandler() {
      this.$copyText.toClipboard(this.textToCopy);
      this.hoverText = 'Copied';
      this.check = true;
      this.$emit('copied');

      this.timer = setTimeout(() => {
        this.hoverText = 'Copy to clipboard';
        this.check = false;
      }, 1000);
    },
  },

  beforeUnmount() {
    clearTimeout(this.timer);
  },
});
</script>

<style lang="scss" scoped>
.copy {
  display: flex;
  position: relative;
  cursor: pointer;

  &:hover {
    color: #000;
  }
}

.hoverhint {
  transition: all 0.1s;

  &:hover {
    &::after {
      background-color: #6b7280;
      bottom: 30px;
      color: #fff;
      content: attr(data-tooltip);
      left: 0;
      padding: 2px;
      position: absolute;
      z-index: 98;
      min-width: 120px;
      font-size: 0.675rem;
      text-align: center;
    }
  }
}
</style>
