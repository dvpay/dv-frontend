<template>
  <div class="card common-wrapper">
    <div class="text-xl mb-6">
      {{ $t('Notifications Types') }}
    </div>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="card-title">
          {{ $t('Systems') }}
          ({{ $t('Cannot be disabled') }})
        </div>
        <div
          v-if="skeletonLoading"
          class="flex flex-col gap-4"
        >
          <ui-skeleton-box
            v-for="i in 2" :key="i"
            width="100%"
            height="21px"
          />
        </div>
        <div v-else class="flex flex-col gap-4">
          <ui-checkbox
            v-for="(item, i) in system"
            class="self-start"
            :key="i"
            :label="item.title"
            v-model="item.checked"
            disabled
          />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="card-title">
          {{ $t('Events') }}
        </div>
        <div
          v-if="skeletonLoading"
          class="flex flex-col gap-4"
        >
          <ui-skeleton-box
            v-for="i in 5" :key="i"
            width="100%"
            height="21px"
          />
        </div>
        <div v-else class="flex flex-col gap-4">
          <ui-checkbox
            v-for="(item, i) in events"
            class="self-start"
            :key="i"
            :label="item.title"
            v-model="item.checked"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="card-title">
          {{ $t('Reports') }}
        </div>
        <div
          v-if="skeletonLoading"
          class="flex flex-col gap-4"
        >
          <ui-skeleton-box
            v-for="i in 3" :key="i"
            width="100%"
            height="21px"
          />
        </div>
        <div v-else class="flex flex-col gap-4">
          <ui-checkbox
            v-for="(item, i) in reports"
            class="self-start"
            :key="i"
            :label="item.title"
            v-model="item.checked"
          />
        </div>
      </div>

      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
        @click="saveHandler"
      >
        {{ $t('Save') }}
      </ui-button-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import { Notification } from '@/services/NotificationsService/types';

interface CheckType {
  title: string;
  value: string;
  checked: boolean;
}

export default defineComponent({
  components: {
    UiButtonLoading,
    UiCheckbox,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: false,
      system: [] as CheckType[],
      events: [] as CheckType[],
      reports: [] as CheckType[],
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('notifications', {
      allNotifications: 'allNotifications',
      userNotifications: 'userNotifications',
      isNotificationsLoaded: 'isNotificationsLoaded',
      notificationsLoadTrigger: 'notificationsLoadTrigger',
    }),
  },

  watch: {
    notificationsLoadTrigger() {
      this.setNotifications();
    },
  },

  created() {
    this.loadNotificationsData();
    this.setNotifications();
  },

  methods: {
    ...mapActions('notifications', [
      'loadNotifications',
      'enableTelegramNotifications',
      'saveUserNotifications',
    ]),

    async loadNotificationsData() {
      try {
        if (!this.isNotificationsLoaded) {
          this.skeletonLoading = true;
        }
        await this.loadNotifications();
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    setNotifications() {
      if (this.isNotificationsLoaded) {
        this.system = this.allNotifications.system.map((item: Notification) => ({
          title: item.name,
          value: item.id,
          checked: true,
        }));

        this.events = this.allNotifications.events.map((item: Notification) => ({
          title: item.name,
          value: item.id,
          checked: !!this.userNotifications.events
            .find((elem: Notification) => elem.id === item.id),
        }));

        this.reports = this.allNotifications.reports.map((item: Notification) => ({
          title: item.name,
          value: item.id,
          checked: !!this.userNotifications.reports
            .find((elem: Notification) => elem.id === item.id),
        }));
      }
    },

    async saveHandler() {
      try {
        this.buttonLoading = true;
        const arrayNotifications = [...this.system, ...this.events, ...this.reports]
          .filter((item) => item.checked)
          .map((item) => item.value);

        await this.saveUserNotifications({
          notifications: arrayNotifications,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Notifications types saved'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
