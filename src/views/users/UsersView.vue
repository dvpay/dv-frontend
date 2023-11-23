<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Users') }}
    </div>
    <div
      v-if="userList.length"
      class="card relative"
    >
      <ui-table
        :columns="tableColumns"
        :data="userList"
        paginationable
        :loading="loading"
        :per-page-default="perPageDefault"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      >
        <template v-slot:cell-roles="{row: item}">
          <div class="flex items-center justify-center gap-2">
            <span
              v-for="(role, i) in item.roles" :key="i"
              class="text-gray-600 px-2 py-1 rounded bg-gray-200"
            >
              {{ role }}
            </span>
          </div>
        </template>
        <template v-slot:cell-actions="{row: item}">
          <div class="flex justify-end gap-4">
            <router-link
              :to="{ name: 'all-users-user', params: { user_id: item.id } }"
              class="button button-primary py-1 px-2"
            >
              {{ $t('Update roles') }}
            </router-link>
            <button
              class="button button-error py-1 px-2"
              :disabled="item.email === userInfo.email"
              @click="deleteUserHandler(item.id)"
            >
              {{ $t('Delete') }}
            </button>
          </div>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  components: {
    UiTable,
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
          label: 'Registration date',
          field: 'created_at',
          textAlign: 'text-center',
        },
        {
          label: 'Owner id',
          field: 'processing_owner_id',
          textAlign: 'text-center',
        },
        {
          label: 'Roles',
          field: 'roles',
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
    ...mapGetters('users', {
      userList: 'getAllUserList',
    }),
    ...mapState('users', {
      pagination: 'pagination',
    }),
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
  },

  async created() {
    if (this.userList.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadAllUsersData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    ...mapActions('users', ['loadAllUsers', 'deleteUser']),

    async loadAllUsersData(page: string, perPage: string) {
      try {
        const params: Record<string, string> = {
          page,
          perPage,
        };
        await this.loadAllUsers(params);
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    async deleteUserHandler(id: number) {
      try {
        this.loading = true;
        await this.deleteUser(id);
        await this.loadAllUsersData(this.currentPage, this.perPageDefault);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    perPageSelectHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadAllUsersData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadAllUsersData(page, perPage);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
