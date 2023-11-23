<template>
  <div
    class="card"
  >
    <div>
      <h2
        class="text-3xl text-center"
      >
        {{ $t('Merchant') }}
      </h2>
      <h3
        class="mt-1 mb-4 text-xl text-center"
      >
        {{ $t('Create your account') }}
      </h3>

      <form
        @submit.prevent="register"
      >
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
          :is-valid="!newPasswordValid && !!password"
          :vatidate-msg="newPasswordValidationMsg"
          @on-validate="newPasswordValidator"
        />

        <ui-input
          required
          v-model="confirmPassword"
          class="mb-6"
          type="password"
          name="confirmPassword"
          :placeholder="$t('Confirm password')"
          :is-valid="!confirmPasswordValid && !!confirmPassword"
          :vatidate-msg="confirmPasswordValidationMsg"
          @on-validate="confirmPasswordValidator"
        />

        <ui-button-loading
          class="button button-primary w-full my-4 p-2"
          type="submit"
          :loading="buttonLoading"
        >
          {{ $t('Create account') }}
        </ui-button-loading>
      </form>
    </div>

    <div
      class="flex items-center justify-center pt-4 text-center"
    >
      <span class="text-sm">
        {{ $t('Already using Merchant?') }}
      </span>

      <router-link
        to="/login"
        class="mx-2 text-sm text-primary-500 hover:text-primary-600 cursor-pointer"
      >
        {{ $t('Sign in here') }}
      </router-link>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
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
      confirmPassword: '',
      buttonLoading: false,
      newPasswordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      newPasswordValidationMsg: '',
      confirmPasswordValidationMsg: '',
    };
  },

  computed: {
    newPasswordValid(): boolean {
      return this.newPasswordRegex.test(this.password);
    },

    confirmPasswordValid(): boolean {
      return this.password === this.confirmPassword;
    },

    passwordsValid(): boolean {
      return this.newPasswordValid && this.confirmPasswordValid;
    },
  },

  methods: {
    async register() {
      try {
        this.buttonLoading = true;
        await this.registerUser({
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmPassword,
          location: Intl.DateTimeFormat().resolvedOptions().timeZone
        });

        await this.loginUser({
          email: this.email,
          password: this.password,
        });

        await this.loadStores();
        await this.loadUserInfo();
        this.buttonLoading = false;
        this.$router.push({ name: 'dashboard' });
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    newPasswordValidator() {
      if (this.password) {
        this.newPasswordValidationMsg = this.newPasswordValid
          ? ''
          : `${this.$t('At least 8 characters')} A-z, 0-9 and @$!%*#?&`;
      } else {
        this.newPasswordValidationMsg = '';
      }
      this.confirmPasswordValidationMsg = '';
    },

    confirmPasswordValidator() {
      if (this.confirmPassword) {
        this.confirmPasswordValidationMsg = this.confirmPasswordValid
          ? ''
          : this.$t('Passwords do not match');
      } else {
        this.confirmPasswordValidationMsg = '';
      }
      this.newPasswordValidationMsg = '';
    },

    ...mapActions('auth', ['registerUser', 'loginUser']),
    ...mapActions('stores', ['loadStores']),
    ...mapActions('user', ['loadUserInfo']),
  },
});
</script>

<style lang="scss" scoped>
.input-invalid {
  border: 1px solid theme('colors.red.400') !important;
}
</style>
