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
        class="mt-1 text-xl text-center"
      >
        {{ $t('Reset password') }}
      </h3>

      <div v-if="!token" class="mt-1">
        <p class="mb-4 text-center text-gray-600">
          {{ $t("We'll email you a link to reset your password") }}
        </p>
        <form @submit.prevent="resetHandler">
          <ui-input
            required
            v-model="email"
            type="email"
            name="email"
            class="mb-2"
            :placeholder="$t('Email')"
          />

          <ui-button-loading
            class="button button-primary w-full my-4 p-2"
            type="submit"
            :loading="buttonLoading"
          >
            {{ $t('Send') }}
          </ui-button-loading>
        </form>
      </div>

      <div v-else class="mt-1">
        <p class="mb-4 text-center text-gray-600">
          {{ $t("Сreate and confirm a new password") }}
        </p>
        <form @submit.prevent="setNewPasswordHandler">
          <ui-input
            required
            v-model="password"
            type="password"
            name="password"
            class="mb-4"
            :placeholder="$t('New password')"
          />

          <ui-input
            required
            v-model="confirmPassword"
            type="password"
            name="confirmPassword"
            class="my-4"
            :placeholder="$t('Confirm new password')"
          />

          <ui-button-loading
            class="button button-primary w-full my-4 p-2"
            type="submit"
            :loading="buttonLoading"
          >
            {{ $t('Reset') }}
          </ui-button-loading>
        </form>
      </div>

    </div>

    <div
      class="flex items-center justify-center pt-4 text-center"
    >
      <span class="text-sm">
        {{ $t('Back to') }}
      </span>

      <router-link
        to="/login"
        class="mx-2 text-sm text-primary-500 hover:text-primary-600 cursor-pointer"
      >
        {{ $t('Sign in') }}
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
      buttonLoading: false,
      password: '',
      confirmPassword: '',
    };
  },

  computed: {
    token() {
      return this.$route.query.token;
    },
  },

  methods: {
    ...mapActions('auth', ['resetPassword', 'setNewPassword']),

    async resetHandler() {
      try {
        this.buttonLoading = true;
        await this.resetPassword({ email: this.email });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Email successfully sent'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    async setNewPasswordHandler() {
      try {
        this.buttonLoading = true;
        await this.setNewPassword({
          token: this.token,
          password: this.password,
          password_confirmation: this.confirmPassword,
        });
        this.buttonLoading = false;
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>
