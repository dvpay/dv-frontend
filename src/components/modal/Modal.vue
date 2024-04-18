<template>
  <transition name="fade">
    <div v-if="visible">
      <div @click="onToggle" class="fixed bg-black opacity-70 inset-0 z-1000"></div>
      <div
          class="w-full max-w-lg p-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto my-auto rounded-xl shadow-lg bg-white z-1001">
        <div>
          <div class="text-center p-3 flex-auto justify-center leading-6">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onToggle() {
      this.$emit('update:visible', !this.visible);
    },
  },
};
</script>
