<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ $t('Change password') }}
    </div>
    <form
      class="form"
      @submit.prevent="changePasswordHandler"
    >
      <ui-input
        v-model="oldPassword"
        type="password"
        id="oldPassword"
        :label="$t('Old Password')"
      />
      <div class="new-password-wrapper relative">
        <ui-input
          v-model="newPassword"
          type="password"
          id="newPassword"
          :is-valid="!newPasswordValid && !!newPassword"
          :label="$t('New Password')"
          @on-validate="newPasswordValidator"
        />
        <div class="form-group relative">
          <ui-input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            :is-valid="!confirmPasswordValid && !!confirmPassword"
            :label="$t('Confirm Password')"
            @on-validate="confirmPasswordValidator"
          />
          <span class="confirm-pass-validation-msg">
            {{ confirmPasswordValidationMsg }}
          </span>
        </div>
        <span
          class="new-pass-validation-msg"
          :class="{ 'new-pass-validation-msg-ru': locale === 'ru' }"
        >
          {{ newPasswordValidationMsg }}
        </span>
      </div>
      <ui-button-loading
        class="button button-primary save-changes-btn"
        type="submit"
        :loading="buttonLoading"
        :disabled="!passwordsValid"
      >
        {{ $t('Save Changes') }}
      </ui-button-loading>
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
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      newPasswordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      buttonLoading: false,
      newPasswordValidationMsg: '',
      confirmPasswordValidationMsg: '',
    };
  },

  computed: {
    newPasswordValid(): boolean {
      return this.newPasswordRegex.test(this.newPassword);
    },

    confirmPasswordValid(): boolean {
      return this.newPassword === this.confirmPassword;
    },

    passwordsValid(): boolean {
      return Boolean(this.oldPassword)
        && this.newPasswordValid
        && this.confirmPasswordValid;
    },

    ...mapState('app', {
      locale: 'locale',
    }),
  },

  methods: {
    async changePasswordHandler() {
      try {
        this.buttonLoading = true;
        await this.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newPassword_confirmation: this.confirmPassword,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Password successfully changed'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    newPasswordValidator() {
      if (this.newPassword) {
        this.newPasswordValidationMsg = this.newPasswordValid
          ? ''
          : this.$t('The password must contain at least 8 characters including lower and upper case latters, numbers and special characters');
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

    ...mapActions('user', ['changePassword']),
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
.new-password-wrapper {
  @apply grid grid-cols-[1fr,1fr] gap-4;

  @include tablet {
    @apply grid-cols-[1fr] gap-6;
  }
}
.input-invalid {
  border: 1px solid theme('colors.red.400') !important;
}

.confirm-pass-validation-msg {
  @apply absolute -bottom-21px text-xs text-red-500;
}

.new-pass-validation-msg {
  @apply absolute -bottom-21px text-xs text-red-500;

  @include tablet {
    @apply -bottom-37px;
  }

  @include phone-lg {
    @apply -bottom-53px;
  }
}

.new-pass-validation-msg-ru {
  @apply -bottom-37px;

  @include phone-lg {
    @apply -bottom-53px;
  }
}

.save-changes-btn {
  @apply py-2 px-4 self-start mt-24px;

  @include phone-lg {
    @apply mt-36px;
  }
}
</style>
