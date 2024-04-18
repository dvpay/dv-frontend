<template>
  <div>Redirecting...</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  mounted() {
    this.loginUserByToken(this.token);
    this.$router.push({ name: 'dashboard' });
  },
  computed: {
    token() {
      return this.$route.params.token;
    },
  },
  methods: {
    ...mapActions('auth', ['loginUserByToken']),
  },
});
</script>
