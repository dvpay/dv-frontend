<template>
  <div class="bg-s-gray h-full">
    <div class="title mb-4">
      {{ $t('FAQ') }}
    </div>
    <ul class="accordion-list">
      <li
        class="accordion-item"
        :class="{ 'bg-white': fieldCollaps(1) }"
      >
        <div
          aria-hidden="true"
          class="accordion-item-title !border-none"
          :class="{ 'accordion-item-title-color': fieldCollaps(1)}"
          @click="expand(1)"
        >
          <span>
            {{ $t('faq_1_question') }}
          </span>
          <feather-icon
            type="chevron-down"
            size="18"
            :class="{'rotate': fieldCollaps(1) }"
          />
        </div>
        <ui-expand :is-expanded="fieldCollaps(1)">
          <div class="accordion-item-text">
            {{ $t('faq_1_answer') }}
          </div>
        </ui-expand>
      </li>
      <li
        class="accordion-item"
        :class="{ 'bg-white': fieldCollaps(2) }"
      >
        <div
          aria-hidden="true"
          class="accordion-item-title"
          :class="{ 'accordion-item-title-color': fieldCollaps(2)}"
          @click="expand(2)"
        >
          <span>
            {{ $t('faq_2_question') }}
          </span>
          <feather-icon
            type="chevron-down"
            size="18"
            :class="{'rotate': fieldCollaps(2) }"
          />
        </div>
        <ui-expand :is-expanded="fieldCollaps(2)">
          <div class="accordion-item-text">
            {{ $t('faq_2_answer') }}
          </div>
        </ui-expand>
      </li>
      <li
        class="accordion-item"
        :class="{ 'bg-white': fieldCollaps(3) }"
      >
        <div
          aria-hidden="true"
          class="accordion-item-title"
          :class="{ 'accordion-item-title-color': fieldCollaps(3)}"
          @click="expand(3)"
        >
          <span>
            {{ $t('faq_3_question') }}
          </span>
          <feather-icon
            type="chevron-down"
            size="18"
            :class="{'rotate': fieldCollaps(3) }"
          />
        </div>
        <ui-expand :is-expanded="fieldCollaps(3)">
          <div class="accordion-item-text">
            {{ $t('faq_3_answer') }}
          </div>
        </ui-expand>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiExpand from '@/components/ui/UiExpand.vue';

export default defineComponent({
  components: {
    UiExpand,
  },

  data() {
    return {
      fieldsCollaps: {} as { [key: number]: boolean },
    };
  },

  computed: {
    fieldCollaps() {
      return (field: number) => {
        return this.fieldsCollaps[field];
      };
    },
  },

  methods: {
    expand(field: number) {
      this.fieldsCollaps = {
        ...this.fieldsCollaps,
        [field]: !this.fieldsCollaps[field],
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  @apply text-center font-600 text-22px;
}

.rotate {
  transform: rotate(-180deg);
}

.accordion-list {
  border: 1px solid #E4E6F1;
  border-radius: 20px;
  background-color: #f4f4f4;
  overflow: hidden;
}

.accordion-item {
  transition: all 150ms ease-in-out;
}

.accordion-item-title {
  @apply flex items-center gap-2 justify-between py-12px px-16px cursor-pointer;
  color: #757685;
  font-weight: 600;
  border-top: 1px solid #DEE0F2;
}

.accordion-item-title-color {
  color: #3F4048;
}

.accordion-item-text {
  @apply px-16px pb-12px;
  color: #62626F;
}
</style>
