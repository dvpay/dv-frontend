<template>
  <ui-top-progress />
  <div class="flex">
    <sidebar-menu
      :is-sidebar-partial="isSidebarPartial"
      :is-show-sidebar="isShowSidebar"
      @close-sidebar="closeSidebar"
      @collapse-sidebar-partial="collapseSidebarPartialHandler"
    />
    <div
      class="content-wrapper relative"
      :class="{
        'content-body-full-ml': !isSidebarPartial,
        'content-body-partial-ml': isSidebarPartial,
      }"
    >
      <navbar-header
        :is-sidebar-partial="isSidebarPartial"
        :is-show-sidebar="isShowSidebar"
        @show-sidebar="showSidebarHandler"
      />
      <div class="content-body">
        <store-settings-menu
          v-if="showStoreSettings"
        />
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import StoreSettingsMenu from '@/components/StoreSettingsMenu.vue';
import NavbarHeader from '@/components/NavbarHeader.vue';
import UiTopProgress from '@/components/ui/UiTopProgress.vue';

export default defineComponent({
  components: {
    SidebarMenu,
    StoreSettingsMenu,
    NavbarHeader,
    UiTopProgress,
  },

  data() {
    return {
      isSidebarPartial: false,
      isShowSidebar: false,
    };
  },

  computed: {
    showStoreSettings() {
      return ['settings'].some((path) => this.$route.path.split('/').indexOf(path) === 3)
        && ['withdrawal-rules'].some((path) => this.$route.path.split('/').indexOf(path) !== 1);
    },
  },

  methods: {
    collapseSidebarPartialHandler() {
      this.isSidebarPartial = !this.isSidebarPartial;
    },

    showSidebarHandler() {
      this.isShowSidebar = !this.isShowSidebar;
    },

    closeSidebar() {
      this.isShowSidebar = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.content-wrapper {
  @apply w-full min-h-screen overflow-y-auto bg-body-bg;
  transition: margin .1s ease-in-out;

  @include laptop {
    margin-left: 0 !important;
  }
}

.content-body {
  @apply p-25px mt-60px;

  @include laptop {
    @apply p-15px;
  }
}

.content-body-full-ml {
  margin-left: var(--sidebar-width);
}

.content-body-partial-ml {
  margin-left: var(--sidebar-partial-width);
}
</style>
