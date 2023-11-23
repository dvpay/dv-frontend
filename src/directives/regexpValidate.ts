import { DirectiveBinding } from 'vue';

function regexpValidate(el: HTMLInputElement, binding: DirectiveBinding) {
  const regex = new RegExp(el.pattern);
  if (regex.test(el.value)) {
    el.setCustomValidity('');
  } else {
    el.setCustomValidity(binding.value);
  }
}

export default regexpValidate;
