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
        class="mt-1 mb-2 text-xl text-center"
      >
        {{ $t('Invite') }}
      </h3>
      <p class="mt-1 mb-4 text-gray-600">
        {{ $t('Create account to accept invite') }}
      </p>

      <form @submit.prevent="acceptInviteHandler">
        <ui-input
          required
          v-model="password"
          type="password"
          class="mb-6"
          :placeholder="$t('Password')"
        />
        <ui-input
          required
          v-model="confirmPassword"
          type="password"
          class="mb-6"
          :placeholder="$t('Confirm password')"
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
      password: '',
      confirmPassword: '',
      buttonLoading: false,
    };
  },

  computed: {
    token() {
      return this.$route.query.token;
    },
  },

  methods: {
    ...mapActions('invite', ['acceptInvite']),
    ...mapActions('auth', ['loginUser']),
    ...mapActions('stores', ['loadStores']),
    ...mapActions('user', ['loadUserInfo']),

    async acceptInviteHandler() {
      try {
        this.buttonLoading = true;

        const email = await this.acceptInvite({
          token: this.token,
          password: this.password,
          password_confirmation: this.confirmPassword,
        });

        await this.loginUser({
          email,
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
  },
});
</script>

<style lang="scss" scoped>
</style>
