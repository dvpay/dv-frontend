<template>
  <div v-if="!userInfo.isEmailVerified">
    <ui-alert
      class="bg-danger-100 text-danger-500 border border-danger-200 mb-6"
      v-model="showAlert"
    >
      <div class="flex items-center gap-4">
        <span>
          {{ $t('Please verify email') }}
        </span>
        <router-link :to="{ name: 'profile' }" class="link underline">
          {{ $t('Verify') }}
        </router-link>
      </div>
    </ui-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import UiAlert from '@/components/ui/UiAlert.vue';

export default defineComponent({
  components: {
    UiAlert,
  },

  data() {
    return {
      showAlert: true,
    };
  },

  computed: {
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
  },
});
</script>

<style lang="scss" scoped>
</style>
