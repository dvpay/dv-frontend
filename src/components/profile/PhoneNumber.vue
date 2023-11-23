<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ $t('Set phone number') }}
    </div>
    <form
      class="form"
      @submit.prevent="savePhoneNumberHandler"
    >
      <div class="form-group">
        <label
          for="phoneNumber"
          class="self-start"
        >
          {{ $t('Phone number') }}
          <span class="font-600">({{ $t('Optional') }})</span>
        </label>
        <ui-input
          v-model="phoneNumber"
          type="number"
          id="phoneNumber"
          placeholder="X XXX XXX XXXX"
        />
      </div>
      <ui-button-loading
        class="button button-primary py-2 px-4 self-start mt-16px"
        type="submit"
        :loading="buttonLoading"
      >
        {{ $t('Save') }}
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
      phoneNumber: '',
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
  },

  mounted() {
    this.syncDataFromVuex();
  },

  methods: {
    async savePhoneNumberHandler() {
      try {
        this.buttonLoading = true;
        await this.updateUserInfo({
          phone: this.phoneNumber.toString(),
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Phone number successfully saved'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    syncDataFromVuex() {
      this.phoneNumber = this.userInfo.phone;
    },

    ...mapActions('user', ['updateUserInfo']),
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
