<template>
  <div>
    <div class="page-title mb-6 flex items-center gap-2">
      <span>{{ $t('Invited User') }}</span>
      <span>{{ invitedUser.email }}</span>
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
          <span>{{ invitedUser.email }}</span>
        </div>
      </div>
      <form
        v-if="invitedUser.accept"
        @submit.prevent="saveHandler"
        class="flex flex-col gap-10"
      >
        <div>
          <div class="card-title mb-4">
            {{ $t('User roles') }}
          </div>
          <div v-if="skeletonLoading" class="flex flex-col gap-4">
            <ui-skeleton-box
              v-for="i in 2" :key="i"
              width="100%"
              height="20px"
            />
          </div>
          <div v-else class="flex flex-col gap-4">
            <ui-checkbox
              v-for="(item, i) in selectedRoles"
              class="self-start"
              :key="i"
              :id="item.value"
              :label="item.title"
              v-model="item.checked"
            />
          </div>
        </div>

        <div>
          <div class="card-title mb-4">
            {{ $t('Access to stores') }}
          </div>
          <div v-if="skeletonLoading" class="flex flex-col gap-4">
            <ui-skeleton-box
              width="100%"
              height="20px"
            />
          </div>
          <div v-else class="flex flex-col gap-4">
            <ui-checkbox
              v-for="(item, i) in selectedStores"
              class="self-start"
              :key="i"
              :id="item.value"
              :label="item.title"
              v-model="item.checked"
            />
          </div>
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
      <div v-else class="flex flex-col gap-8">
        <ui-skeleton-box
          v-if="skeletonLoading"
          width="100%"
          height="22px"
        />
        <div v-else class="text-red-500 font-600">
          {{ $t('User has not accepted invite yet') }}
        </div>
        <ui-skeleton-box
          v-if="skeletonLoading"
          width="100%"
          height="36px"
        />
        <ui-button-loading
          v-else
          class="button button-primary py-2 px-4 self-start"
          :loading="buttonLoading"
          @click="sendInviteHandler"
        >
          {{ $t('Re-Send Invite') }}
        </ui-button-loading>
      </div>
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

type StoreType = RoleType;

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
      selectedStores: [] as StoreType[],
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('invite', {
      invitedUser: 'invitedUser',
    }),
    ...mapState('dictionaries', {
      allRoles: 'roles',
    }),
    ...mapState('stores', {
      storeList: 'storeList',
    }),

    roles(): string[] {
      return this.allRoles.filter((item: string) => item !== 'root');
    },

    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    invitedUser() {
      this.syncDataFromVuex();
    },
  },

  created() {
    this.loadUserData();
    this.syncDataFromVuex();
  },

  methods: {
    ...mapActions('invite', ['loadInvitedUser', 'sendInvite', 'updateInvitedUser']),

    syncDataFromVuex() {
      this.selectedRoles = this.roles.map((item: string) => ({
        title: item,
        value: item,
        checked: !!this.invitedUser.roles.find((elem: string) => elem === item),
      }));
      this.selectedStores = this.storeList.map((item: { id: string, name: string }) => ({
        title: item.name,
        value: item.id,
        checked: !!this.invitedUser.stores.find((elem: string) => elem === item.id),
      }));
    },

    async loadUserData() {
      try {
        await this.loadInvitedUser(this.id);
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    async saveHandler() {
      const selectedRolesArray = this.selectedRoles
        .filter((item) => item.checked)
        .map((item) => item.value);

      const selectedStoresArray = this.selectedStores
        .filter((item) => item.checked)
        .map((item) => item.value);

      try {
        this.buttonLoading = true;
        await this.updateInvitedUser({
          invitedId: this.id,
          payload: {
            roles: selectedRolesArray,
            stores: selectedStoresArray,
          },
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Settings successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    async sendInviteHandler() {
      try {
        this.buttonLoading = true;
        await this.sendInvite({
          email: this.invitedUser.email,
          role: this.invitedUser.role,
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
</style>
