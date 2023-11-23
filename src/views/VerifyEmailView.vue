<template>
  <div class="p-80px flex items-center justify-center">
    <div class="flex flex-col items-center gap-8">
      <i-preloader v-if="loading" />
      <div
        v-if="!loading && !status"
        class="flex flex-col items-center gap-6"
      >
        <div class="flex flex-col items-center gap-2 text-success-500">
          <feather-icon type="check" size="40" />
          <span class="text-2xl">
            {{ $t('Email successfully verified') }}
          </span>
        </div>
        <ui-button-loading
          class="button button-primary py-2 px-8"
          :loading="buttonLoading"
          @click="backButtonHandler"
        >
          {{ $t('Back') }}
        </ui-button-loading>
      </div>
      <div
        v-if="status === 'verified'"
        class="flex flex-col items-center gap-6 text-success-500"
      >
        <span class="text-2xl">{{ statusMsg }}</span>
        <ui-button-loading
          class="button button-primary py-2 px-8"
          :loading="buttonLoading"
          @click="backButtonHandler"
        >
          {{ $t('Back') }}
        </ui-button-loading>
      </div>
      <div v-if="status === 'error'" class="text-2xl">
        {{ statusMsg }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import IPreloader from '@/components/icon/IPreloader.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';

export default defineComponent({
  components: {
    IPreloader,
    UiButtonLoading,
  },

  data() {
    return {
      loading: false,
      buttonLoading: false,
      status: '',
      statusMsg: '',
    };
  },

  computed: {
    id() {
      return this.$route.query.id;
    },

    hash() {
      return this.$route.query.hash;
    },

    ...mapGetters('auth', ['isAuth']),
  },

  created() {
    this.verifyEmailHandler();
  },

  methods: {
    async verifyEmailHandler() {
      try {
        this.status = '';
        this.statusMsg = '';
        this.loading = true;
        await this.verifyEmail({
          id: Number(this.id),
          hash: this.hash,
        });
        this.loading = false;
      } catch (e) {
        if (e.status === 404) {
          this.status = 'verified';
          this.statusMsg = this.$t('Email already verified');
        } else {
          this.status = 'error';
          this.statusMsg = this.$t('Something went wrong');
        }
        this.loading = false;
      }
    },

    async backButtonHandler() {
      try {
        this.buttonLoading = true;
        if (this.isAuth) {
          await this.loadStores();
          await this.loadUserInfo();
          this.$router.push({ name: 'dashboard' });
        } else {
          this.$router.push({ name: 'login' });
        }
        this.buttonLoading = false;
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    ...mapActions('stores', ['loadStores']),
    ...mapActions('user', ['verifyEmail', 'loadUserInfo']),
  },
});
</script>

<style lang="scss" scoped>
</style>
