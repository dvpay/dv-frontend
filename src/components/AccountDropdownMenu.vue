<template>
  <div
    class="dropdown-menu"
    @click.stop
  >
    <div class="flex items-center flex-col gap-4 justify-center p-4 border-b border-gray-200">
      <div class="border-2 border-body-color rounded-1/2 h-34px w-34px flex items-center justify-center">
        <feather-icon
          type="user"
          size="28"
        />
      </div>
      <div class="text-gray-600 break-all text-center">
        {{ userInfo.email }}
      </div>
    </div>
    <ul class="pt-1">
      <li
        aria-hidden="true"
        class="dropdown-menu-item"
        @click="closeHandler"
      >
        <router-link
          class="dropdown-menu-link"
          to="/profile"
        >
          <feather-icon type="user" size="18" class="dropdown-menu-icon" />
          <span>
            {{ $t('Profile') }}
          </span>
        </router-link>
      </li>
      <li
        aria-hidden="true"
        class="dropdown-menu-item"
        @click="logout"
      >
        <span
          class="dropdown-menu-link"
        >
          <feather-icon type="log-out" size="18" class="dropdown-menu-icon" />
          <span>
            {{ $t('Log Out') }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({

  emits: ['closeAccountDropdownMenu'],

  computed: {
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
  },

  methods: {
    closeHandler() {
      this.$emit('closeAccountDropdownMenu');
    },

    async logout() {
      this.closeHandler();
      await this.logoutUser();
    },

    ...mapActions('auth', ['logoutUser']),
  },
});
</script>

<style lang="scss" scoped>
.dropdown-menu {
  @apply shadow-medium p-1;
  width: 200px;
  position: absolute;
  right: -15px;
  top: 62px;
  left: auto;
  background: #fff;

  &::before {
    content: "";
    width: 13px;
    height: 13px;
    background: #fff;
    position: absolute;
    top: -7px;
    right: 20px;
    transform: rotate(45deg);
    border-top: 1px solid theme('colors.gray.200');
    border-left: 1px solid theme('colors.gray.200');
  }
}

.dropdown-menu-item {
  &:hover {
    @apply bg-primary-100;

    .dropdown-menu-icon {
      @apply text-primary-500;
    }
  }
}

.dropdown-menu-link {
  @apply flex items-center gap-4 px-4 py-2 cursor-pointer;
}

.dropdown-menu-icon {
  @apply text-gray-600;
}
</style>
