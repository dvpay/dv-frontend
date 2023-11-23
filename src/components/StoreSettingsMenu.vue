<template>
  <div class="mb-8 relative">
    <h2 class="mb-6 page-title">
      {{ $t('Project Settings') }}
    </h2>

    <div class="navlink-wrapper">
      <router-link
        class="navlink"
        :to="{ name: 'store-settings-general', params: { store_id: storeIdFromUrl } }"
      >
        {{ $t('General') }}
      </router-link>
      <router-link
        class="navlink"
        :class="{ 'router-link-active': webhooksTabActive }"
        :to="{ name: 'store-settings-advanced', params: { store_id: storeIdFromUrl } }"
      >
        {{ $t('Advanced') }}
      </router-link>
    </div>
    <div class="line"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    storeIdFromUrl() {
      return this.$route.params.store_id;
    },

    webhooksTabActive() {
      const input = 'webhooks';
      return this.$route.path.split('/').find((item) => item === input);
    },
  },
});
</script>

<style lang="scss" scoped>
.navlink-wrapper {
  @apply flex flex-nowrap relative z-2 whitespace-nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.navlink-wrapper {
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}

.navlink {
  @apply py-4 mr-8;

  &:last-child {
    @apply mr-0;
  }
}

.navlink.router-link-exact-active,
.navlink.router-link-active {
  @apply border-b-2 border-primary-500;
}

.line {
  @apply absolute z-1 bottom-0 h-2px w-full bg-gray-200;
}
</style>
