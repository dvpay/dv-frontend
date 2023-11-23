<template>
  <div class="qrcode">
    <qrcode-vue
      :value="value"
      :size="size"
      render-as="svg"
      :level="level"
    />
    <img
      v-if="img"
      class="qrcode-image"
      alt="img"
      :src="image(`${img}`)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { image } from '@/utils';

export default defineComponent({
  components: {
    QrcodeVue,
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 100,
    },
    img: {
      type: String,
    },
    level: {
      type: String as PropType<'L' | 'M' | 'Q' | 'H'>,
    },
  },

  methods: {
    image,
  },
});
</script>

<style lang="scss" scoped>
.qrcode {
  display: flex;
  justify-content: center;
  position: relative;
}

.qrcode-image {
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  width: 48px;
}
</style>
