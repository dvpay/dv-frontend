<template>
  <div class="card">
    <div class="mb-4 flex items-center gap-2">
      <div class="card-title">
        {{ $t('Verify Email') }}
      </div>
      <div
        v-if="userInfo.isEmailVerified"
        class="text-success-500 flex items-center gap-1"
      >
        <feather-icon type="check-circle" size="18" />
        <span>
          {{ $t('Verified') }}
        </span>
      </div>
      <div
        v-else
        class="text-warning-500 flex items-center gap-1"
      >
        <feather-icon type="alert-triangle" size="18" />
        <span>
            {{ $t('Unverified') }}
          </span>
      </div>
    </div>
    <form
      class="form"
      @submit.prevent="verifyHandler"
    >
      <ui-input
        v-model="email"
        type="text"
        id="emailVerify"
        :disabled="userInfo.isEmailVerified"
        :label="$t('Email')"
      />
      <div class="flex items-center gap-4 mt-16px relative">
        <ui-button-loading
          v-if="!userInfo.isEmailVerified"
          class="button button-primary py-2 px-4 self-start"
          type="submit"
          :loading="buttonLoading"
          :disabled="!!timer"
        >
          {{ $t('Send email to verify') }}
        </ui-button-loading>
        <span v-if="timer" class="text-gray-600 w-50px">
          {{ formatTimer }}
        </span>
        <span v-else class="w-50px"></span>
        <div v-if="showMsg" class="text-blue-500 absolute -top-26px">
          {{ $t('Please check email to complete verify') }}
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      email: '',
      buttonLoading: false,
      timerInterval: 0 as unknown as ReturnType<typeof setInterval>,
      timer: 0,
      showMsg: false,
    };
  },

  computed: {
    formatTimer(): string {
      const seconds = Math.floor(this.timer % 60);
      const minutes = Math.floor((this.timer / 60) % 60);

      return `${(`0${minutes}`).slice(-2)} : ${(`0${seconds}`).slice(-2)}`;
    },

    ...mapState('user', {
      userInfo: 'userInfo',
    }),
  },

  mounted() {
    this.syncDataFromVuex();
  },

  unmounted() {
    clearInterval(this.timerInterval);
    this.showMsg = false;
  },

  methods: {
    async verifyHandler() {
      try {
        this.buttonLoading = true;
        if (this.userInfo.email !== this.email.trim()) {
          await this.updateUserInfo({
            email: this.email,
          });
        }
        await this.sendEmailConfirmation();
        this.buttonLoading = false;
        this.$toast.success(this.$t('Email has been successfully sent'));
        this.showMsg = true;
        this.startTimer();
      } catch (e) {
        this.buttonLoading = false;
        this.showMsg = false;
        clearInterval(this.timerInterval);
      }
    },

    syncDataFromVuex() {
      this.email = this.userInfo.email;
    },

    startTimer() {
      this.timer = 60;
      this.timerInterval = setInterval(this.updateTimer, 1000);
    },

    updateTimer() {
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        return;
      }
      this.timer--;
    },

    ...mapActions('user', ['updateUserInfo', 'sendEmailConfirmation']),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-6;
}
.form-group {
  @apply flex flex-col gap-2;
}
</style>
