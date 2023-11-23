<template>
  <div
    class="navbar-header"
    :class="{
      'navbar-header-w': !isSidebarPartial,
      'navbar-header-w-part': isSidebarPartial,
    }"
  >
    <i-burger-menu
      class="navbar-header-burger"
      :toggle="isShowSidebar"
      @click="showSidebarHandler"
    />
    <div class="flex basis-full h-full justify-end">
      <div class="flex basis-full mx-25px my-10px <laptop:mx-15px <phone-lg:mr-0">
        <stores-dropdown-multiselect
          v-if="getStoreOptionsLocal.length"
          class="w-400px <tablet:w-full"
          :options="getStoreOptionsLocal"
          :selected="getStoreSelectedOptionsLocal"
          :extra-option="extraOption"
          @change="storeSelectHandler"
          @on-close="filterHandler"
        />
        <button
          class="button button-primary button-filter relative"
          @click="filterHandler"
        >
          <span
            class="flex items-center gap-1 relative"
            :class="{'opacity-0': storeFilterBtnLoading}"
          >
            <feather-icon type="filter" size="18" />
            <span>{{ $t('Filter') }}</span>
          </span>
          <span
            v-if="storeFilterBtnLoading"
            class="absolute right-0 left-0 -top-2px transform translate-y-1/2"
          >
             <feather-icon
               type="loader"
               size="20"
               class="animate-spin text-white"
             />
          </span>
        </button>
      </div>
      <div class="navbar-nav">
        <div
          aria-hidden="true"
          class="dropdown"
          @click="showLocaleSelectDropdown"
          v-click-out="closeLocaleSelectDropdown"
        >
          <div class="flex items-center gap-2">
            <i class="fi" :class="selectedLocaleOption.flagIconClass"></i>
            <span class="text-sm <tablet:hidden">
              {{ selectedLocaleOption.title }}
            </span>
          </div>
          <locale-select-dropdown
            v-if="isShowLocaleSelectDropdown"
            class="top-42px -right-15px"
            :locale-options="localeOptions"
            @change-locale="changeLocaleHandler"
            @close-locale-select-dropdown="closeLocaleSelectDropdown"
          />
        </div>
        <div
          aria-hidden="true"
          class="navbar-nav-item dropdown"
          @click="showAccountDropdownMenu"
          v-click-out="closeAccountDropdownMenu"
        >
          <div class="border-2 border-body-color rounded-1/2 h-22px w-22px flex items-center justify-center">
            <feather-icon
              type="user"
              size="18"
              stroke-width="3"
            />
          </div>
          <account-dropdown-menu
            v-if="isShowAccountDropdownMenu"
            @close-account-dropdown-menu="closeAccountDropdownMenu"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import IBurgerMenu from '@/components/icon/IBurgerMenu.vue';
import AccountDropdownMenu from '@/components/AccountDropdownMenu.vue';
import StoresDropdownMultiselect from '@/components/StoresDropdownMultiselect.vue';
import LocaleSelectDropdown from '@/components/LocaleSelectDropdown.vue';
import { MultiSelectOptionType } from '@/components/types';

export default defineComponent({
  components: {
    IBurgerMenu,
    AccountDropdownMenu,
    StoresDropdownMultiselect,
    LocaleSelectDropdown,
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

  emits: ['showSidebar'],

  data() {
    return {
      isShowAccountDropdownMenu: false,
      selectedArray: [] as MultiSelectOptionType[],
      extraOption: {
        title: 'All',
        value: 'all',
        checked: false,
      },
      options: [] as MultiSelectOptionType[],
      isShowLocaleSelectDropdown: false,
    };
  },

  computed: {
    ...mapState('stores', {
      storeOptions: 'storeOptions',
      storeFilterBtnLoading: 'storeFilterBtnLoading',
    }),
    ...mapGetters('stores', {
      getStoreOptionsLocal: 'getStoreOptionsLocal',
      getStoreSelectedOptionsLocal: 'getStoreSelectedOptionsLocal',
      isAllStoresSelected: 'isAllStoresSelected',
    }),
    ...mapGetters('app', {
      selectedLocaleOption: 'selectedLocaleOption',
    }),
    ...mapState('user', ['userInfo']),
    ...mapState('app', {
      localeOptions: 'localeOptions',
    }),
  },

  watch: {
    getStoreOptionsLocal() {
      this.syncDataFromVuex();
    },
  },

  mounted() {
    this.syncDataFromVuex();
    if (this.userInfo.language) {
      this.changeLocale(this.userInfo.language);
    }
  },

  methods: {
    showSidebarHandler() {
      this.$emit('showSidebar');
    },

    showAccountDropdownMenu() {
      this.isShowAccountDropdownMenu = !this.isShowAccountDropdownMenu;
    },

    closeAccountDropdownMenu() {
      this.isShowAccountDropdownMenu = false;
    },

    changeLocaleHandler(value: string) {
      this.changeLocale(value);
      this.updateLocale(value);
    },

    changeLocale(value: string) {
      this.setLocale(value);
      this.$i18n.locale = value;
    },

    async updateLocale(value: string) {
      try {
        await this.updateUserInfo({
          language: value,
        });
      } catch (e) {
        console.error(e);
      }
    },

    showLocaleSelectDropdown() {
      this.isShowLocaleSelectDropdown = !this.isShowLocaleSelectDropdown;
    },

    closeLocaleSelectDropdown() {
      this.isShowLocaleSelectDropdown = false;
    },

    storeSelectHandler(value: string, index: number) {
      if (value === 'extra') {
        this.extraOption.checked = !this.extraOption.checked;

        const storeOptions = this.getStoreOptionsLocal.map((item: MultiSelectOptionType) => {
          return {
            ...item,
            checked: this.extraOption.checked,
          };
        });

        this.setStoreOptionsLocal(storeOptions);
      } else {
        let storeOptions = [...this.getStoreOptionsLocal];

        if (this.extraOption.checked) {
          storeOptions = storeOptions.map((item: MultiSelectOptionType) => {
            return {
              ...item,
              checked: false,
            };
          });
        }

        this.extraOption.checked = false;
        storeOptions[index].checked = !storeOptions[index].checked;
        this.setStoreOptionsLocal(storeOptions);
      }
    },

    syncDataFromVuex() {
      this.extraOption.checked = this.isAllStoresSelected;
    },

    filterHandler() {
      this.setStoreFilterTrigger();
      this.checkAll();
    },

    checkAll() {
      const storesNotChecked = this.getStoreOptionsLocal.every((item: MultiSelectOptionType) => !item.checked);

      if (!this.extraOption.checked && storesNotChecked) {
        this.extraOption.checked = true;
        const storeOptions = this.getStoreOptionsLocal.map((item: MultiSelectOptionType) => {
          return {
            ...item,
            checked: true,
          };
        });
        this.setStoreOptionsLocal(storeOptions);
      }
    },

    ...mapMutations('stores', ['setStoreOptionsLocal', 'setStoreFilterTrigger']),
    ...mapMutations('app', ['setLocale']),
    ...mapActions('user', ['updateUserInfo']),
  },
});
</script>

<style lang="scss" scoped>
.navbar-header {
  @apply fixed h-60px bg-white border-b flex items-center p-0 right-0 shadow-basic z-9;
  transition: width .1s ease,left .1s ease;

  @include laptop {
    left: 0 !important;
    width: 100% !important;
  }
}

.navbar-header-w {
  width: calc(100% - var(--sidebar-width));
  left: var(--sidebar-width);
}

.navbar-header-w-part {
  width: calc(100% - var(--sidebar-partial-width));
  left: var(--sidebar-partial-width);
}

.navbar-header-burger {
  @apply px-25px border-r h-full items-center hidden;

  @include laptop {
    @apply flex;
  }

  @include phone-lg {
    @apply px-15px;
  }
}

.navbar-nav {
  @apply flex px-25px h-full items-center gap-25px;

  @include laptop {
    @apply px-15px gap-15px;
  }
}

.navbar-nav-item {
  @apply h-full flex items-center;
}

.dropdown {
  @apply relative cursor-pointer;
}

.button-filter {
  @apply px-3;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;

  @include phone-lg {
    @apply px-2;
  }
}
</style>
