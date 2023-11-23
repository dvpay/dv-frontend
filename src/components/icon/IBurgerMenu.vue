<template>
  <div>
    <div
      class="burger-menu"
      :class="{ 'burger-menu-open': toggle }"
      aria-hidden="true"
    >
      <span></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    toggle: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.burger-menu {
  display: flex;
  align-items: center;
  position: relative;
  width: 18px;
  height: 18px;
  cursor: pointer;
  z-index: 1;
  overflow: hidden;
}

.burger-menu > span,
.burger-menu > span::before,
.burger-menu > span::after {
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #7987a1;
  transition: all .2s;
}
.burger-menu > span::before {
  content: '';
  top: -6px;
}
.burger-menu > span::after {
  content: '';
  top: 6px;
}

.burger-menu.burger-menu-open > span {
  transform: rotate(45deg);
}
.burger-menu.burger-menu-open > span::before {
  top: 0;
  transform: rotate(0);
}
.burger-menu.burger-menu-open > span::after {
  top: 0;
  transform: rotate(90deg);
}
</style>
