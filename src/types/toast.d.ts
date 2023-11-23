import { ToastInterface } from 'vue-toastification';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ToastInterface;
  }
}
