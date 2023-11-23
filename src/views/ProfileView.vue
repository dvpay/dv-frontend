<template>
  <div class="mb-80px">
    <div class="page-title mb-6">
      {{ $t('Profile') }}
    </div>
    <div class="profile-content-wrapper">
      <verify-email class="verify-email" />
      <phone-number class="phone-number" />
      <notifications-targets class="notification" />
      <change-password class="change-password" />
      <two-factor class="two-factor" />
      <displaying-rules class="displaying-rules" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PhoneNumber from '@/components/profile/PhoneNumber.vue';
import ChangePassword from '@/components/profile/ChangePassword.vue';
import VerifyEmail from '@/components/profile/VerifyEmail.vue';
import TwoFactor from '@/components/profile/TwoFactor.vue';
import DisplayingRules from '@/components/profile/DisplayingRules.vue';
import NotificationsTargets from '@/components/notifications/NotificationsTargets.vue';

export default defineComponent({
  components: {
    NotificationsTargets,
    PhoneNumber,
    ChangePassword,
    VerifyEmail,
    TwoFactor,
    DisplayingRules,
  },
});
</script>

<style lang="scss" scoped>
.profile-content-wrapper {
  max-width: 1200px;
  display: grid;
  gap: 16px;
  grid-template-areas: "verify phone" "password notification" "twofa twofa" "displaying displaying";

  @include laptop {
    max-width: 100%;
  }

  @include laptop-lg {
    grid-template-areas: "verify" "phone" "password" "notification" "twofa" "displaying";
  }
}

.verify-email {
  grid-area: verify;
}
.phone-number {
  grid-area: phone;
}
.change-password {
  grid-area: password;
}
.two-factor {
  grid-area: twofa;
}
.displaying-rules {
  grid-area: displaying;
}
</style>
