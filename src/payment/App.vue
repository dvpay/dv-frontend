<template>
  <component :is="resolveLayout">
    <router-view />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import PaymentLayout from '@/layouts/PaymentLayout.vue';

export default defineComponent({
  components: {
    DefaultLayout,
    PaymentLayout,
  },

  computed: {
    resolveLayout() {
      return this.$route.meta.layout || 'default-layout';
    },
  },
});
</script>

<style lang="scss">
#app {}
</style>
