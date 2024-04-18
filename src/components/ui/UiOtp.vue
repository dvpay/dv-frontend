<template>
  <div ref="otpCont" class="flex flex-row items-center justify-between">
    <input
        type="tel"
        v-for="(el, ind) in digits"
        class="w-16 h-16 flex flex-col items-start justify-end text-center px-5 outline-none rounded-xl border font-medium border-gray-200 text-lg bg-gray-200 focus:bg-gray-50 focus:ring-1 ring-blue-1"
        :key="el + ind"
        v-model="digits[ind]"
        :autofocus="ind === 0"
        maxlength="1"
        @keydown="handleKeyDown($event, ind)"
        :class="{ bounce: digits[ind] !== null }"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  default: String,
  digitCount: {
    type: Number,
    required: true,
  },
});
const digits = reactive([]);
if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i);
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}
const otpCont = ref(null);
const emit = defineEmits(['update:otp']);
const isDigitsFull = () => {
  for (const elem of digits) {
    if (elem == null || elem == undefined) {
      return false;
    }
  }
  return true;
};
const handleKeyDown = (event, index) => {
  if (event.key !== 'Tab' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
    event.preventDefault();
  }

  if (event.key === 'Backspace') {
    digits[index] = null;

    if (index != 0) {
      otpCont.value.children[index - 1].focus();
    }
    return;
  }
  if (new RegExp('^([0-9])$').test(event.key)) {
    digits[index] = event.key;
    if (index != props.digitCount - 1) {
      otpCont.value.children[index + 1].focus();
    }
    if (isDigitsFull()) {
      emit('update:otp', digits.join(''));
    }
  }
};
</script>
