<template>
  <div class="relative z-11">
    <div class="header">
      <div class="text-26px text-white">
        {{ invoice.store }}
      </div>
      <div class="flex items-center gap-2 text-white">
        <a
          v-if="invoice.returnUrl"
          :href="invoice.returnUrl"
          target="_blank"
          ref="noopener noreferrer"
          class="border-2 border-white rounded-48px py-10px px-22px leading-16px text-sm cursor-pointer"
        >
          {{ $t('Go to the store') }}
        </a>
        <div
          v-if="invoice.storeStatus === 1"
          aria-hidden="true"
          class="flex cursor-pointer relative"
          @click="showDropdownMenu"
          v-click-out="closeDropdownMenu"
        >
          <feather-icon
            class="border-2 border-white rounded-1/2 p-8px"
            :type="isShowDropdownMenu ? 'x' : 'more-vertical'"
            size="20"
          />
          <div
            v-if="isShowDropdownMenu"
            class="dropdown-menu"
            @click.stop
          >
            <div
              v-for="(page, i) in pages"
              :key="i"
              aria-hidden="true"
              class="dropdown-menu-item"
              :class="{ 'dropdown-menu-item-selected': page.page === currentPage }"
              @click="clickHandler(page.page)"
            >
              {{ $t(page.title) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showUpdaterCountdown"
      class="absolute w-full"
    >
      <payment-form-updater />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import PaymentFormUpdater from '@/components/paymentForm/PaymentFormUpdater.vue';

export default defineComponent({
  components: {
    PaymentFormUpdater,
  },

  data() {
    return {
      isShowDropdownMenu: false,
    };
  },

  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
      pages: 'pages',
      currentPage: 'currentPage',
      stepPayment: 'stepPayment',
      invoiceMsgStatus: 'invoiceMsgStatus',
    }),

    showUpdaterCountdown(): boolean {
      return this.currentPage === 1
        && this.stepPayment === 3
        && !this.invoiceMsgStatus.formHide;
    },
  },

  methods: {
    ...mapMutations('invoice', ['setCurrentPage']),

    clickHandler(page: number) {
      this.setCurrentPage(page);
      this.closeDropdownMenu();
    },

    showDropdownMenu() {
      this.isShowDropdownMenu = !this.isShowDropdownMenu;
    },

    closeDropdownMenu() {
      this.isShowDropdownMenu = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  @apply px-20px py-15px flex items-center justify-between bg-dark-gray;
}

.dropdown-menu {
  color: theme('colors.dark-gray');
  padding: 8px;
  position: absolute;
  right: 0;
  top: 50px;
  left: auto;
  background: #fff;
  box-shadow: 0 15px 30px rgba(88, 95, 107, 0.18);
  border-radius: 20px;
  z-index: 99;
}

.dropdown-menu-item {
  @apply px-16px py-8px whitespace-nowrap text-center font-600;

  &:hover {
    @apply bg-gray-200 rounded-48px;
  }
}

.dropdown-menu-item-selected {
  @apply rounded-48px text-white font-500;
  @apply bg-dark-gray #{!important};
}
</style>
