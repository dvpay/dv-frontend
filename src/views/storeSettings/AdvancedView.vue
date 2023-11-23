<template>
  <div class="flex flex-col gap-6">
    <api-keys />
    <webhooks-list />
    <return-urls />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApiKeys from '@/components/storeSettings/ApiKeys.vue';
import WebhooksList from '@/components/storeSettings/WebhooksList.vue';
import ReturnUrls from '@/components/storeSettings/ReturnUrls.vue';

export default defineComponent({
  components: {
    ApiKeys,
    WebhooksList,
    ReturnUrls,
  },
});
</script>

<style lang="scss" scoped>
</style>
