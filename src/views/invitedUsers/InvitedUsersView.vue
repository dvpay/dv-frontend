<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Invited Users') }}
        </div>
        <router-link
          class="button button-primary px-6 py-3 flex items-center gap-2"
          :to="{ name: 'invited-users-invite' }"
        >
          <feather-icon type="plus" size="18" />
          <span>{{ $t('Invite User') }}</span>
        </router-link>
      </div>
    </div>
    <div v-if="isInvitedUsersLoaded" class="card">
      <ui-table
        v-if="invitedUsers.length"
        :columns="tableColumns"
        :data="invitedUsers"
        paginationable
        :loading="loading"
        :per-page-default="perPageDefault"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      >
        <template v-slot:cell-role="{row: item}">
          <span class="text-gray-600 px-2 py-1 rounded bg-gray-200">
            {{ item.role }}
          </span>
        </template>
        <template v-slot:cell-accept="{row: item}">
          <span
            :class="[item.accept ? 'success-status' : 'error-status']"
          >
            {{ item.accept ? $t('Yes') : $t('No') }}
          </span>
        </template>
        <template v-slot:cell-roles="{row: item}">
          <div v-if="item.roles" class="flex items-center justify-center gap-2">
            <span
              v-for="(role, i) in item.roles" :key="i"
              class="text-gray-600 px-2 py-1 rounded bg-gray-200"
            >
              {{ role }}
            </span>
          </div>
          <div v-else class="text-gray-600">
            {{ $t('Roles are not set yet') }}
          </div>
        </template>
        <template v-slot:cell-token="{row: item}">
          <div class="flex items-center gap-2 justify-center">
            <a :href="invitationLink(item.token)" target="_blank" class="link">
              {{ `${invitationLink(item.token).slice(0, 20)}...${invitationLink(item.token).slice(-7)}` }}
            </a>
            <ui-copy-to-clipboard
              :text-to-copy="invitationLink(item.token)"
            />
          </div>
        </template>
        <template v-slot:cell-actions="{row: item}">
          <div class="flex justify-end gap-4">
            <button
              v-if="!item.accept"
              class="button button-secondary py-1 px-2"
              @click="reSendInviteHandler(item.email, item.role)"
            >
              {{ $t('Re-Send Invite') }}
            </button>
            <router-link
              v-else
              :to="{ name: 'invited-users-user', params: { id: item.id } }"
              class="button button-primary py-1 px-2"
            >
              {{ $t('Settings') }}
            </router-link>
          </div>
        </template>
      </ui-table>
      <div v-else class="text-gray-600">
        {{ $t('There are no invited users.') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiTable,
    UiCopyToClipboard,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Email',
          field: 'email',
          textAlign: 'text-left',
        },
        {
          label: 'Invite date',
          field: 'created_at',
          textAlign: 'text-center',
        },
        {
          label: 'Role by invite',
          field: 'role',
          textAlign: 'text-center',
        },
        {
          label: 'Invite accepted',
          field: 'accept',
          textAlign: 'text-center',
        },
        {
          label: 'Roles',
          field: 'roles',
          textAlign: 'text-center',
        },
        {
          label: 'Invitation link',
          field: 'token',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      loading: false,
      currentPage: '1',
      perPageDefault: '25',
    };
  },

  computed: {
    ...mapState('invite', {
      isInvitedUsersLoaded: 'isInvitedUsersLoaded',
      pagination: 'pagination',
    }),
    ...mapGetters('invite', {
      invitedUsers: 'getInvitedUsers',
    }),

    invitationLink() {
      return (token: string) => {
        return `${window.location.origin}/invite?token=${token}`;
      };
    },
  },

  async created() {
    if (this.invitedUsers.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadInvitedUsersData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    ...mapActions('invite', ['loadInvitedUsers', 'sendInvite']),

    async loadInvitedUsersData(page: string, perPage: string) {
      try {
        const params: Record<string, string> = {
          page,
          perPage,
        };
        await this.loadInvitedUsers(params);
        this.loading = false;
      } catch (e) {
        this.$store.commit('app/setProgressBar', 'stop');
        this.loading = false;
      }
    },

    perPageSelectHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadInvitedUsersData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadInvitedUsersData(page, perPage);
    },

    async reSendInviteHandler(email: string, role: string) {
      try {
        this.loading = true;
        await this.sendInvite({ email, role });
        this.loading = false;
        this.$toast.success(this.$t('Invite has been sent'));
      } catch (e) {
        this.loading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
