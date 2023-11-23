<template>
  <div>
    <div class="page-title mb-6 flex items-center gap-2">
      <span>{{ $t('User') }}</span>
      <span>{{ user.email }}</span>
    </div>
    <div
      class="card common-wrapper"
    >
      <div class="card-title mb-4">
        {{ $t('User info') }}
      </div>
      <div class="mb-6">
        <ui-skeleton-box
          v-if="skeletonLoading"
          width="100%"
          height="22px"
        />
        <div v-else class="flex items-center gap-4">
          <span>{{ $t('Email') }}:</span>
          <span>{{ user.email }}</span>
        </div>
      </div>
      <form
        @submit.prevent="saveHandler"
        class="flex flex-col gap-6"
      >
        <div class="flex items-center gap-4 h-21px">
          <div class="card-title">
            {{ $t('User roles') }}
          </div>
          <div class="flex items-center justify-center gap-2">
            <div
              v-for="(role, i) in selectedRoles" :key="i"
            >
              <span
                v-if="role.checked"
                class="bg-gray-200 rounded py-1 px-2"
              >
                {{ role.title }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="skeletonLoading" class="flex flex-col gap-4">
          <ui-skeleton-box
            v-for="i in 3" :key="i"
            width="100%"
            height="20px"
          />
        </div>
        <div
          v-else
          class="flex flex-col gap-4"
        >
          <ui-checkbox
            v-for="(item, i) in selectedRoles"
            class="self-start"
            :key="i"
            :id="item.value"
            :label="item.title"
            v-model="item.checked"
          />
        </div>
        <ui-skeleton-box
          v-if="skeletonLoading"
          width="100%"
          height="36px"
        />
        <ui-button-loading
          v-else
          class="button button-primary py-2 px-4 self-start"
          type="submit"
          :loading="buttonLoading"
        >
          {{ $t('Save') }}
        </ui-button-loading>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

interface RoleType {
  title: string;
  value: string;
  checked: boolean;
}

export default defineComponent({
  components: {
    UiCheckbox,
    UiButtonLoading,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: true,
      selectedRoles: [] as RoleType[],
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('users', {
      user: 'user',
    }),
    ...mapState('dictionaries', {
      roles: 'roles',
    }),

    userId() {
      return this.$route.params.user_id;
    },
  },

  watch: {
    user() {
      this.syncDataFromVuex();
    },
  },

  created() {
    this.loadUserData();
    this.syncDataFromVuex();
  },

  methods: {
    ...mapActions('users', ['loadUser', 'updateUserRoles']),

    syncDataFromVuex() {
      if (this.user.roles.length) {
        this.selectedRoles = this.roles.map((item: string) => ({
          title: item,
          value: item,
          checked: !!this.user.roles.find((elem: string) => elem === item),
        }));
      }
    },

    async loadUserData() {
      try {
        await this.loadUser(this.userId);
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    async saveHandler() {
      const selectedRolesArray = this.selectedRoles
        .filter((item) => item.checked)
        .map((item) => item.value);

      try {
        this.buttonLoading = true;
        await this.updateUserRoles({
          userId: this.userId,
          payload: {
            roles: selectedRolesArray,
          },
        });
        this.$toast.success(this.$t('User roles successfully updated'));
        this.buttonLoading = false;
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
