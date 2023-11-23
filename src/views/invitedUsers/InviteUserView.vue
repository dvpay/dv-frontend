<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Invite User') }}
    </div>
    <div class="card common-wrapper">
      <div class="text-2xl mb-6">
        {{ $t('Invite') }}
      </div>
      <form
        class="form"
        @submit.prevent="inviteHandler"
      >
        <ui-input
          required
          v-model="emailForInvite"
          type="email"
          id="emailForInvite"
          :placeholder="$t('Email')"
          :label="$t('Email For Invite')"
        />
        <div class="form-group">
          <label
            for="rolesSelect"
            class="self-start"
          >
            {{ $t('Role') }}
          </label>
          <ui-select
            id="rolesSelect"
            class="max-w-120px h-40px"
            v-model="roleSelected"
            :options="rolesOptions"
          />
        </div>
        <ui-button-loading
          class="button button-primary py-2 px-4 self-start mt-2"
          type="submit"
          :loading="buttonLoading"
        >
          {{ $t('Send Invite') }}
        </ui-button-loading>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiSelect,
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      emailForInvite: '',
      roleSelected: 'support',
      rolesOptions: [
        {
          title: 'Suppport',
          value: 'support',
        },
      ],
      buttonLoading: false,
    };
  },

  methods: {
    ...mapActions('invite', ['sendInvite']),

    async inviteHandler() {
      try {
        this.buttonLoading = true;
        await this.sendInvite({
          email: this.emailForInvite,
          role: this.roleSelected,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Invite has been sent'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },
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
