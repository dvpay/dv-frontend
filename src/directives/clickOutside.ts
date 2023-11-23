import { ObjectDirective, DirectiveBinding } from 'vue';

interface ExtendedDirectiveBinding<T = any> extends DirectiveBinding<T> {
  event?: T;
}

const clickOutside: ObjectDirective = {
  beforeMount(el, binding: ExtendedDirectiveBinding) {
    binding.event = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        if (binding.value instanceof Function) {
          binding.value(event);
        }
      }
    };
    document.body.addEventListener('click', binding.event);
  },
  unmounted(el, binding: ExtendedDirectiveBinding) {
    document.body.removeEventListener('click', binding.event);
  },
};

export default clickOutside;
