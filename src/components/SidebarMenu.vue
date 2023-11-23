<template>
  <aside>
    <div
      class="sidebar"
      :class="{'sidebar-show': isShowSidebar}"
    >
      <div
        class="sidebar-nav-menu"
      >
        <div
          class="sidebar-header"
          :class="{
            'sidebar-full-width': !isSidebarPartial,
            'sidebar-partial-width sidebar-header-partial-width': isSidebarPartial,
          }"
        >
          <logo-nav
            class="sidebar-logo"
          />
          <i-burger-menu
            v-if="!isShowSidebar"
            :toggle="isSidebarPartial"
            @click="collapseSidebarPartialHandler"
          />
          <i-burger-menu
            v-if="isShowSidebar"
            :toggle="isShowSidebar"
            @click="closeSidebarHandler"
          />
        </div>

        <div
          class="sidebar-body-wrapper"
          :class="{
            'sidebar-full-width': !isSidebarPartial,
            'sidebar-partial-width': isSidebarPartial,
          }"
        >
          <nav
            class="sidebar-body"
          >
            <div v-if="showMainMenu">
              <div class="nav-category">
                {{ $t('Main') }}
              </div>

              <router-link
                class="sidelink"
                :to="{ name: 'dashboard' }"
                @click="closeSidebarHandler"
              >
                <span class="flex">
                  <feather-icon type="box" size="18" />
                </span>
                <span class="sidebar-link-title">
                  {{ $t('Dashboard') }}
                </span>
              </router-link>

              <router-link
                class="sidelink"
                :to="{ name: 'stores' }"
                :class="{'router-link-active': storeSettingsLinkActive }"
                @click="closeSidebarHandler"
              >
                <span class="flex">
                  <feather-icon type="shopping-bag" size="18" />
                </span>
                <span class="sidebar-link-title">
                  {{ $t('Your Projects') }}
                </span>
              </router-link>

              <router-link
                class="sidelink"
                :to="{ name: 'balances' }"
                :class="{'router-link-active': balancesLinkActive}"
                @click="closeSidebarHandler"
              >
                <span class="flex">
                  <feather-icon type="dollar-sign" size="18"/>
                </span>
                <span class="sidebar-link-title">
                  {{ $t('Hot Wallets') }}
                </span>
              </router-link>



              <router-link
                class="sidelink"
                :to="{ name: 'withdrawal' }"
                :class="{'router-link-active': withdrawalRulesLinkActive}"
                @click="closeSidebarHandler"
              >
                <span class="flex">
                  <feather-icon type="sliders" size="18"/>
                </span>
                <span class="sidebar-link-title">
                  {{ $t('Withdrawal Rules') }} 2.0
                </span>
              </router-link>


              <router-link
                class="sidelink"
                :to="{ name: 'support-search-tx' }"
                @click="closeSidebarHandler"
              >
                <span class="flex">
                  <feather-icon type="search" size="18"/>
                </span>
                <span class="sidebar-link-title">
                  {{ $t('Search Transactions') }}
                </span>
              </router-link>

              <router-link
                class="sidelink"
                :to="{ name: 'transfer' }"
                @click="closeSidebarHandler"
              >
                <span class="flex">
                  <feather-icon type="send" size="18"/>
                </span>
                <span class="sidebar-link-title">
                  {{ $t('Transfers') }}
                </span>
              </router-link>

              <div class="nav-category mt-4">
                {{ $t('Misc') }}
              </div>

              <div
                aria-hidden="true"
                class="sidelink-expand"
                :class="{'router-link-active': historyAndLogs || invoicesLinkActive}"
                @click="expand($event, 'history_and_logs')"
              >
                <div class="flex items-center gap-4">
                  <feather-icon type="monitor" size="18"/>
                  <span class="sidelink-expand-title">
                    {{ $t('History & Logs') }}
                  </span>
                </div>
                <feather-icon
                  type="chevron-down"
                  size="14"
                  class="sidelink-expand-angle"
                  :class="{'rotate': fieldCollapsed('history_and_logs') }"
                />
              </div>

              <ui-expand :is-expanded="fieldCollapsed('history_and_logs')">
                <ul class="nav-expand">
                  <li class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'invoices' }"
                      :class="{'router-link-active': invoicesLinkActive}"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Invoices') }}
                    </span>
                    </router-link>
                  </li>
                  <li class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'withdrawals' }"
                      :class="{'router-link-active': withdrawalsLinkActive}"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Withdrawals History') }}
                    </span>
                    </router-link>
                  </li>
                  <li class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :class="{'router-link-active': monitoringLinkActive }"
                      :to="{ name: 'monitoring' }"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Monitoring') }}
                    </span>
                    </router-link>
                  </li>
                </ul>
              </ui-expand>

              <div
                aria-hidden="true"
                class="sidelink-expand"
                :class="{'router-link-active': settingsExpandActive}"
                @click="expand($event, 'settings')"
              >
                <div class="flex items-center gap-4">
                  <feather-icon type="settings" size="18"/>
                  <span class="sidelink-expand-title">
                  {{ $t('Settings') }}
                </span>
                </div>
                <feather-icon
                  type="chevron-down"
                  size="14"
                  class="sidelink-expand-angle"
                  :class="{'rotate': fieldCollapsed('settings') }"
                />
              </div>

              <ui-expand :is-expanded="fieldCollapsed('settings')">
                <ul class="nav-expand">
                  <li v-if="rootUser" class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'root-settings' }"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Root Settings') }}
                    </span>
                    </router-link>
                  </li>
                  <li class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'rates-and-fees' }"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Rates & Fees') }}
                    </span>
                    </router-link>
                  </li>
                  <li class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'notifications' }"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Notifications') }}
                    </span>
                    </router-link>
                  </li>
                  <li v-if="rootUser" class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'all-users' }"
                      :class="{'router-link-active': usersLinkActive}"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Users') }}
                    </span>
                    </router-link>
                  </li>
                </ul>
              </ui-expand>
            </div>
            <div v-if="showSupportMenu">
              <div
                aria-hidden="true"
                class="sidelink-expand"
                :class="{'router-link-active': supportExpandActive}"
                @click="expand($event, 'support')"
              >
                <div class="flex items-center gap-4">
                  <feather-icon type="headphones" size="18"/>
                  <span class="sidelink-expand-title">
                  {{ $t('Support') }}
                </span>
                </div>
                <feather-icon
                  type="chevron-down"
                  size="14"
                  class="sidelink-expand-angle"
                  :class="{'rotate': fieldCollapsed('support') }"
                />
              </div>

              <ui-expand :is-expanded="fieldCollapsed('support')">
                <ul class="nav-expand">
                  <li v-if="showMainMenu" class="nav-expand-item">
                    <router-link
                      class="sidelink-expand-link"
                      :to="{ name: 'invited-users' }"
                      :class="{'router-link-active': invitedUsersLinkActive}"
                      @click="closeSidebarHandler"
                    >
                    <span class="sidelink-expand-link-title">
                      {{ $t('Invited Users') }}
                    </span>
                    </router-link>
                  </li>
                  <li class="nav-expand-item">
                    <a
                      :href="api.documentationUrl"
                      target="_blank"
                      class="sidelink-expand-link"
                    >
                    <span class="sidelink-expand-link-title">
                      API
                    </span>
                    </a>
                  </li>
                </ul>
              </ui-expand>
            </div>
          </nav>

        <p class="px-6">{{ $t('Version') }}: {{  version }}</p>
        </div>
      </div>
    </div>
    <div
      class="backdrop"
      :class="{'backdrop-show': isShowSidebar}"
      aria-hidden="true"
      @click="closeSidebarHandler"
    ></div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import IBurgerMenu from '@/components/icon/IBurgerMenu.vue';
import LogoNav from '@/components/LogoNav.vue';
import UiExpand from '@/components/ui/UiExpand.vue';

export default defineComponent({
  components: {
    IBurgerMenu,
    LogoNav,
    UiExpand,
  },

  props: {
    isSidebarPartial: {
      type: Boolean,
      default: false,
    },

    isShowSidebar: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['collapseSidebarPartial', 'closeSidebar'],

  computed: {
    storeSettingsLinkActive() {
      return (['settings'].some((path) => this.$route.path.split('/').indexOf(path) === 3)
        && ['withdrawal-rules'].some((path) => this.$route.path.split('/').indexOf(path) !== 1))
      || (
        ['stores'].some((path) => this.$route.path.split('/').indexOf(path) === 1)
        && ['create'].some((path) => this.$route.path.split('/').indexOf(path) === 2)
      );
    },

    withdrawalsLinkActive() {
      const input = 'withdrawals';
      return this.$route.path.split('/').find((item) => item === input);
    },

    invoicesLinkActive() {
      const matches = ['invoices', 'invoices-list'];
      const pathArr = this.$route.path.split('/');
      return matches.some((path) => pathArr.indexOf(path) === 1 || pathArr.indexOf(path) === 2);
    },

    monitoringLinkActive() {
      const path = this.$route.path.split('/')[1];
      return path === 'monitoring';
    },

    withdrawalRulesLinkActive() {
      const path = this.$route.path.split('/')[1];
      return path === 'withdrawal-rules';
    },

    usersLinkActive() {
      const path = this.$route.path.split('/')[1];
      return path === 'all-users';
    },

    invitedUsersLinkActive() {
      const path = this.$route.path.split('/')[1];
      return path === 'invited-users';
    },

    historyAndLogs() {
      const matches = ['monitoring', 'withdrawals'];
      const path = this.$route.path.split('/')[1];
      return matches.some((match) => match === path);
    },

    settingsExpandActive() {
      const matches = ['displaying', 'rates-and-fees', 'notifications', 'all-users'];
      const path = this.$route.path.split('/')[1];
      return matches.some((match) => match === path);
    },

    supportExpandActive() {
      const matches = ['invited-users'];
      const path = this.$route.path.split('/')[1];
      return matches.some((match) => match === path);
    },

    balancesLinkActive() {
      const path = this.$route.path.split('/')[1];
      return path === 'balances';
    },

    fieldCollapsed() {
      return (field: string) => {
        return this.getNavCollapsed(field);
      };
    },

    showMainMenu() {
      return this.userInfo.email
        && (this.userRole === 'root' || this.userRole === 'admin');
    },

    rootUser() {
      return this.userInfo.email && this.userRole === 'root';
    },

    showSupportMenu() {
      return this.userInfo.email
        && (this.userRole === 'root' || this.userRole === 'admin' || this.userRole === 'support');
    },

    ...mapGetters('app', ['getNavCollapsed']),
    ...mapGetters('user', {
      userRole: 'userRole',
    }),
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
    ...mapState('dictionaries', {
      api: 'api',
      version: 'version'
    }),
  },

  methods: {
    closeSidebarHandler() {
      this.$emit('closeSidebar');
    },

    collapseSidebarPartialHandler() {
      this.$emit('collapseSidebarPartial');
    },

    expand(e: Event, field: string) {
      e.stopPropagation();
      this.setNavCollapsed({ [field]: !this.fieldCollapsed(field) });
    },

    ...mapMutations('app', ['setNavCollapsed']),
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  @apply fixed z-999;
  transition: all .1s ease;

  @include laptop {
    transform: translateX(var(--sidebar-width--));
  }
}

.sidebar-show {
  transform: translateX(0);
}

.sidebar-nav-menu {
  @apply flex flex-col h-screen;
}

.sidebar-header {
  @apply px-6 border-b flex gap-3 items-center justify-between bg-white shadow-basic border-r;
  transition: width .1s ease;
  flex-basis: 60px;
}

.sidebar-logo {
  transition: all .1s ease;
}

.sidebar-body-wrapper {
  @apply flex flex-col justify-between shadow-basic bg-white border-r overflow-y-auto overflow-x-hidden;
  transition: all .1s ease;
  flex-basis: calc(100% - 60px);
}

.sidebar-body-wrapper.sidebar-partial-width {
  &:hover {
    width: var(--sidebar-width);

    .sidebar-link-title {
      visibility: visible;
      opacity: 1;
    }

    .nav-category {
      visibility: visible;
      opacity: 1;

      &::before {
        visibility: hidden;
        opacity: 0;
      }
    }

    .sidelink-expand-title {
      visibility: visible;
      opacity: 1;
    }

    .sidelink-expand-link-title {
      visibility: visible;
      opacity: 1;
    }
  }
}

.sidebar-body {
  @apply py-6 overflow-y-auto overflow-x-hidden;
}

.sidebar-footer {
  @apply flex items-center border-t relative;
}

.sidebar-full-width {
  width: var(--sidebar-width);
}

.sidebar-partial-width {
  width: var(--sidebar-partial-width);
}

.sidebar-link-title {
  transition: all .1s ease;
  min-width: 130px;
}

.sidebar-partial-width .sidebar-link-title {
  visibility: hidden;
  opacity: 0;
  min-width: 130px;
}

.sidebar-partial-width .sidebar-logo {
  visibility: hidden;
  opacity: 0;
  width: 0;
}

.sidebar-header-partial-width {
  @apply gap-0;
}

.nav-category {
  @apply text-secondary-500 font-500 uppercase text-11px flex items-center mx-6 mb-2;
}

.sidebar-partial-width .nav-category {
  visibility: hidden;
  position: relative;

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: theme('colors.secondary.500');
    position: absolute;
    top: 5px;
    left: 6px;
    visibility: visible;
  }
}

.sidelink {
  @apply py-2 px-6 flex items-center gap-4;
}

.sidelink:not(.router-link-exact-active):hover,
.sidelink:not(.router-link-active):hover {
  @apply text-primary-500;
}

.sidelink.router-link-exact-active,
.sidelink.router-link-active {
  @apply text-primary-500;

  &::before {
    content: "";
    width: 3px;
    height: 26px;
    background: theme('colors.primary.500');
    position: absolute;
    left: 0;
  }
}

.sidelink {
  .sidebar-link-title {
    -webkit-transition: all 150ms linear;
    transition: all 150ms linear;
  }

  &:hover {
    .sidebar-link-title {
      transform: translateX(2px);
    }
  }
}

.sidebar-footer-link {
  @apply flex items-center px-6 py-4 gap-4 w-full cursor-pointer hover:text-primary-500;
}

.sidebar-footer-link.router-link-exact-active,
.sidebar-footer-link.router-link-active {
  @apply text-primary-500;

  &::before {
    content: "";
    width: 3px;
    height: 26px;
    background: theme('colors.primary.500');
    position: absolute;
    left: 0;
  }
}

.backdrop {
  @apply fixed w-screen h-screen bg-black z-100 opacity-0 invisible;
  transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;
}

.backdrop-show {
  @apply visible opacity-70;
}

.nav-expand {
  @apply flex flex-col pr-6 pt-1 pb-4 pl-60px text-13px;
}

.nav-expand-item {
  @apply relative cursor-pointer h-28px flex items-center;
}

.sidelink-expand {
  @apply py-2 px-6 flex items-center justify-between cursor-pointer relative;
}

.sidelink-expand:not(.router-link-exact-active):hover,
.sidelink-expand:not(.router-link-active):hover {
  @apply text-primary-500;
}

.sidelink-expand.router-link-exact-active,
.sidelink-expand.router-link-active {
  @apply text-primary-500;

  &::before {
    content: "";
    width: 3px;
    height: 26px;
    background: theme('colors.primary.500');
    position: absolute;
    left: 0;
  }
}

.sidelink-expand {
  .sidelink-expand-title {
    -webkit-transition: all 150ms linear;
    transition: all 150ms linear;
    min-width: 130px;
  }

  &:hover {
    .sidelink-expand-title {
      transform: translateX(2px);
    }
  }
}

.sidebar-partial-width .sidelink-expand-title {
  visibility: hidden;
  opacity: 0;
  min-width: 130px;
}

.sidelink-expand-angle {
  transition: transform 150ms ease-in-out;
}
.rotate {
  transform: rotate(-180deg);
}

.sidelink-expand-link {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: 0 0;
    border: 1px solid #aeb9c4;
    position: absolute;
    left: -29px;
    top: 12px;
    -webkit-transition: all 150ms ease-in-out;
    transition: all 150ms ease-in-out;
  }
}

.sidelink-expand-link {
  span {
    -webkit-transition: all 150ms linear;
    transition: all 150ms linear;
  }

  &:hover {
    span {
      transform: translateX(5px);
    }
  }
}

.sidelink-expand-link:not(.router-link-exact-active):hover,
.sidelink-expand-link:not(.router-link-active):hover {
  @apply text-primary-500;

  &::before {
    background: theme('colors.primary.500');
    border: 1px solid theme('colors.primary.500');
  }
}

.sidelink-expand-link.router-link-exact-active,
.sidelink-expand-link.router-link-active {
  @apply text-primary-500;

  &::before {
    background: theme('colors.primary.500');
    border: 1px solid theme('colors.primary.500');
  }
}

.sidebar-partial-width .sidelink-expand-link-title {
  visibility: hidden;
  opacity: 0;
}
</style>
