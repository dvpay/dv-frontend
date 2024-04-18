<template>
  <div class="wrapper">
    <vue-qr3
      :data="data"
      :width="size"
      :height="size"
      :margin="0"
      :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: level }"
      :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 4, crossOrigin: 'anonymous' }"
      :dotsOptions="{ color: color }"
      :backgroundOptions="{ color: bgColor }"
      :cornersSquareOptions="{ type: '', color: color, gradient: null }"
      :cornersDotOptions="{ type: '', color: color }"
      :image="image(`${img}`)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import VueQr3 from '@/components/qrcode';
import { image } from '@/utils';

export default defineComponent({
  components: {
    VueQr3,
  },

  props: {
    data: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 200,
    },
    img: {
      type: String,
    },
    level: {
      type: String as PropType<'L' | 'M' | 'Q' | 'H'>,
    },
    color: {
      type: String,
    },
    bgColor: {
      type: String,
      default: '#ffffff',
    },
  },

  methods: {
    image,
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
  border: 4px solid v-bind(color);
  overflow: hidden;
  border-radius: 20px;
  padding: 8px;
}
</style>
