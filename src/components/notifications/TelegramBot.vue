<template>
  <div class="relative">
    <button
      class="flex items-center gap-2 rounded-32px button-secondary pr-4"
      @click="start"
    >
      <img
        class="w-32px"
        src="@/assets/img/icons/telegram.svg" alt="telegram"
      >
      {{ $t('Subscribe') }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  data() {
    return {
      enabled: false,
      loading: false,
    };
  },

  methods: {
    start() {
      this.startTelegramBot();
    },

    ...mapActions('notifications', ['startTelegramBot']),
  },
});
</script>

<style lang="scss" scoped>
</style>
