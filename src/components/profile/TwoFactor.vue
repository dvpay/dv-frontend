<template>
  <div class="card relative">
    <div class="flex items-center gap-2 justify-between">
      <div class="flex items-center gap-2">
        <div class="card-title">
          {{ $t('Two-Factor Authentication') }}
        </div>
        <div
          v-if="userInfo.google2faStatus"
          class="text-success-500 flex items-center gap-1"
        >
          <feather-icon type="check-circle" size="18" />
          <span>
            {{ $t('Confirmed') }}
          </span>
        </div>
        <div
          v-else
          class="text-warning-500 flex items-center gap-1"
        >
          <feather-icon type="alert-triangle" size="18" />
          <span>
            {{ $t('Unconfirmed') }}
          </span>
        </div>
      </div>
      <ui-switcher
        :checked="twoFaEnabled"
        @switched="twoFaToggleHandler"
      />
    </div>
    <ui-expand :is-expanded="twoFaEnabled">
      <div class="mt-4 pt-4 flex gap-10 border-t-1 border-gray-200 <tablet:flex-col-reverse">
        <div>
          <p class="mb-4">
            {{ $t('twofa-desc-1') }}
          </p>
          <p class="mb-4">
            {{ $t('twofa-desc-2') }}
          </p>
          <p class="uppercase font-600 mb-4">
            {{ $t('To enable two-factor authentication, follow these steps:') }}
          </p>
          <p class="mt-4 mb-2">
            1. {{ $t('Download the authenticator app on your cell phone.') }}
          </p>
          <p class="mb-2">
            {{ $t('We recommend that you use:') }}
          </p>
          <p class="mb-2 font-600">
            Google Authenticator
          </p>
          <div class="flex gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              ref="noopener noreferrer"
              class="relative"
            >
              <span class="absolute text-white left-42px top-1px" style="font-size: 10px;">{{ $t('Get it on') }}</span>
              <img src="@/assets/img/google-play.svg" alt="google-play">
            </a>
            <a
              href="https://apps.apple.com/us/app/google-authenticator/id388497605"
              target="_blank"
              ref="noopener noreferrer"
              class="relative"
            >
              <span class="absolute text-white left-36px top-1px" style="font-size: 10px;">{{ $t('Download on') }}</span>
              <img src="@/assets/img/app-store.svg" alt="app-store">
            </a>
          </div>
          <p class="mt-4 mb-2">
            2. {{ $t('Add an account to the authenticator app.') }}
          </p>
          <p>
            <span class="text-red-500">{{ $t('Important!') }}&nbsp;</span>
            <span>
              {{ $t('Do not show your Secret Key and QRCode to anyone.') }}
              {{ $t('This data is strictly confidential.') }}
            </span>
          </p>
          <p class="mt-4">
            3. {{ $t('Enter the password generated by the application in the "verification code" field.') }}
          </p>
          <p class="mt-4">
            4. {{ $t('Press "Confirm" button.') }}
          </p>
        </div>
        <div v-if="userInfo.google2faUrl" class="min-w-256px flex flex-col gap-4 <tablet:max-w-256px mx-auto">
          <div class="font-600 uppercase">
            {{ $t('Secret key:') }}
          </div>
          <div class="p-4 border border-gray-200 flex items-center justify-between bg-gray-300">
            <span>
              {{ userInfo.google2faSecret }}
            </span>
            <ui-copy-to-clipboard :text-to-copy="userInfo.google2faSecret" />
          </div>
          <ui-qrcode
            :value="userInfo.google2faUrl"
            :size="256"
            level="L"
          />
          <div
            v-if="userInfo.google2faStatus"
            class="p-4 border border-gray-200 flex flex-col text-center items-center justify-between uppercase"
          >
            <div>
              {{ $t('Two-Factor Authentication') }}
            </div>
            <div>
              {{ $t('Confirmed') }}
            </div>
          </div>
          <form
            v-else
            class="flex flex-col gap-4"
            @submit.prevent="confirmVerificationCode"
          >
            <ui-input
              required
              v-model="verificationCode"
              type="number"
              :placeholder="$t('Verification code')"
            />
            <ui-button-loading
              class="button button-primary py-2"
              type="submit"
              :loading="confirmBtnLoading"
            >
              {{ $t('Confirm') }}
            </ui-button-loading>
          </form>
        </div>
      </div>
    </ui-expand>
    <ui-loading :loading="toggleTwoFaLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';
import { mapState, mapActions } from 'vuex';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiExpand from '@/components/ui/UiExpand.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiQrcode from '@/components/ui/UiQrcode.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiSwitcher,
    UiLoading,
    UiExpand,
    UiCopyToClipboard,
    UiQrcode,
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      toggleTwoFaLoading: false,
      verificationCode: '',
      confirmBtnLoading: false,
    };
  },

  computed: {
    twoFaEnabled(): boolean {
      return !!this.userInfo.google2faSecret;
    },

    ...mapState('user', {
      userInfo: 'userInfo',
    }),
  },

  methods: {
    async twoFaToggleHandler() {
      try {
        this.toggleTwoFaLoading = true;
        await this.toggleTwoFa({ status: !this.twoFaEnabled });
        this.toggleTwoFaLoading = false;
      } catch (e) {
        this.toggleTwoFaLoading = false;
      }
    },

    async confirmVerificationCode() {
      try {
        this.confirmBtnLoading = true;
        await this.validateTwoFa({
          googleCode: this.verificationCode,
        });
        this.confirmBtnLoading = false;
        this.$toast.success(this.$t('Two-Factor Authentication enabled'));
      } catch (e) {
        this.confirmBtnLoading = false;
      }
    },

    ...mapActions('user', ['toggleTwoFa', 'validateTwoFa']),
  },
});
</script>

<style lang="scss" scoped>
</style>
