<template>
  <div class="card common-wrapper">
    <div class="text-xl mb-6">
      {{ $t('Receiving Notifications Method') }}
    </div>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <ui-switcher
            :checked="checked(1)"
            @switched="switchHandler(1)"
          />
          <span>Telegram</span>
        </div>
        <ui-expand v-if="!isTgBotSubscribed" :is-expanded="checked(1)">
          <div class="flex flex-col gap-2">
            <div>
              {{ $t('Subscribe to the telegram bot first') }}
            </div>
            <telegram-bot />
          </div>
        </ui-expand>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <ui-switcher
            :checked="checked(2)"
            @switched="switchHandler(2)"
          />
          <span>Email</span>
        </div>
      </div>

      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
        @click="saveTargets"
      >
        {{ $t('Save') }}
      </ui-button-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';
import UiExpand from '@/components/ui/UiExpand.vue';
import TelegramBot from '@/components/notifications/TelegramBot.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { NotificationTarget } from '@/services/NotificationsService/types';

interface CheckType {
  title: string;
  value: number;
  checked: boolean;
}

export default defineComponent({
  components: {
    UiSwitcher,
    UiExpand,
    TelegramBot,
    UiButtonLoading,
  },

  data() {
    return {
      isTgBotSubscribed: false,
      targets: [] as CheckType[],
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
    ...mapState('notifications', {
      allNotificationsTargets: 'allNotificationsTargets',
      userNotificationsTargets: 'userNotificationsTargets',
      isNotificationsTargetsLoaded: 'isNotificationsTargetsLoaded',
      notificationsLoadTargetsTrigger: 'notificationsLoadTargetsTrigger',
    }),

    checked() {
      return (id: number) => {
        return this.targets.reduce((acc: boolean, curr: CheckType) => {
          if (curr.value === id) {
            return curr.checked;
          }
          return acc;
        }, false);
      };
    },

    notificationsStatus(): string {
      return this.checked(1) ? 'enabled' : 'disabled';
    },
  },

  watch: {
    userInfo() {
      this.setIsTgBotSubscribed();
    },

    notificationsLoadTargetsTrigger() {
      this.setTargets();
    },
  },

  created() {
    this.loadNotificationsTargets();
    this.setTargets();
    this.setIsTgBotSubscribed();
  },

  methods: {
    ...mapActions('notifications', [
      'loadNotificationsTargets',
      'saveUserNotificationsTargets',
      'enableTelegramNotifications',
    ]),
    ...mapActions('user', ['loadUserInfo']),

    setIsTgBotSubscribed() {
      this.isTgBotSubscribed = this.userInfo.telegramNotification === 'enabled';
    },

    switchHandler(id: number) {
      this.targets = this.targets.map((item: CheckType) => ({
        ...item,
        checked: item.value === id ? !item.checked : item.checked,
      }));
    },

    setTargets() {
      if (this.isNotificationsTargetsLoaded) {
        this.targets = this.allNotificationsTargets.map((item: NotificationTarget) => ({
          title: item.slug,
          value: item.id,
          checked: !!this.userNotificationsTargets
            .find((elem: NotificationTarget) => elem.id === item.id),
        }));
      }
    },

    async enableTelegramNotificationsHandler() {
      await this.enableTelegramNotifications({
        status: this.notificationsStatus,
      });
    },

    async saveTargets() {
      try {
        this.buttonLoading = true;
        const targets = this.targets
          .filter((item) => item.checked)
          .map((item) => item.value);

        await this.saveUserNotificationsTargets({
          targets,
        });
        await this.enableTelegramNotificationsHandler();
        await this.loadUserInfo();
        this.setIsTgBotSubscribed();
        this.buttonLoading = false;
        this.$toast.success(this.$t('Notifications targets saved'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
