<template>
  <div
    v-if="!twoFaEnabled"
    class="card"
  >
    <div>
      <h2
        class="text-3xl"
      >
        {{ $t('Merchant') }}
      </h2>
      <h3
        class="mt-1 text-xl text-center"
      >
        {{ $t('Welcome Back') }}
      </h3>
      <p class="mt-1 mb-4 text-gray-600">
        {{ $t('Login or create account') }}
      </p>

      <form @submit.prevent="login">
        <ui-input
          required
          v-model="email"
          class="mb-6"
          type="email"
          name="email"
          :placeholder="$t('Email')"
        />

        <ui-input
          required
          v-model="password"
          class="mb-6"
          type="password"
          name="password"
          :placeholder="$t('Password')"
        />

        <router-link
          :to="{ name: 'reset' }"
          class="inline-block text-sm cursor-pointer text-primary-500 hover:text-primary-600"
        >
          {{ $t('Forgot password?') }}
        </router-link>

        <ui-button-loading
          class="button button-primary w-full my-4 p-2"
          type="submit"
          :loading="buttonLoading"
        >
          {{ $t('Login') }}
        </ui-button-loading>
      </form>
    </div>

    <div
      v-if="enabledRegistration"
      class="flex items-center justify-center pt-4"
    >
      <span class="text-sm">
        {{ $t("Don't have an account?") }}
      </span>

      <router-link
        to="/register"
        class="mx-2 text-sm text-primary-500 hover:text-primary-600 cursor-pointer"
      >
        {{ $t('Register') }}
      </router-link>
    </div>
  </div>
  <div
    v-else
    class="card"
  >
    <h3
      class="text-xl text-center mb-4"
    >
      {{ $t('Two-Factor Authentication') }}
    </h3>
    <form @submit.prevent="login">
      <ui-input
        required
        v-model="twoFaCode"
        class="my-2"
        type="number"
        :placeholder="$t('Verification code')"
        name="code"
      />
      <ui-button-loading
        class="button button-primary w-full my-4 p-2"
        type="submit"
        :loading="buttonLoading"
      >
        {{ $t('Login') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import { LoginUserRequest } from '@/services/AuthService/types';
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
      password: '',
      buttonLoading: false,
      twoFaEnabled: false,
      twoFaCode: '',
    };
  },

  computed: {
    ...mapState('settings', {
      enabledRegistration: 'enabledRegistrationNoAuth',
    }),
  },

  methods: {
    async login() {
      try {
        this.buttonLoading = true;

        const payload: LoginUserRequest = {
          email: this.email,
          password: this.password,
        };

        if (this.twoFaCode) {
          payload.googleCode = this.twoFaCode;
        }

        await this.loginUser(payload);
        await this.loadStores();
        await this.loadUserInfo();
        this.buttonLoading = false;
        this.$router.push({ name: 'dashboard' });
      } catch (e) {
        this.buttonLoading = false;
        if (e.message === 'twofa') {
          this.twoFaEnabled = true;
        }
      }
    },

    ...mapActions('auth', ['loginUser']),
    ...mapActions('stores', ['loadStores']),
    ...mapActions('user', ['loadUserInfo']),
  },
});
</script>
