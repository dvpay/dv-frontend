<template>
  <div class="footer w-full py-18px px-16px lg:px-0">
    <payer-form-nav-buttons />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PayerFormNavButtons from '@/components/payerForm/PayerFormNavButtons.vue';

export default defineComponent({
  components: { PayerFormNavButtons },
});
</script>
