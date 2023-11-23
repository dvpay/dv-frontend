import { createApp } from 'vue';
import Toast, { PluginOptions, useToast } from 'vue-toastification';
import useClipboard from 'vue-clipboard3';
import VueFeather from 'vue-feather';
import App from './payment/App.vue';
import router from './payment/router';
import store from './payment/store';
import { SentryPlugin } from './payment/plugins';
import { i18n } from './plugins';
import { clickOutside, regexpValidate } from './directives';
// eslint-disable-next-line import/no-unresolved
import 'virtual:windi.css';
import 'vue-toastification/dist/index.css';
import 'flag-icons/css/flag-icons.min.css';

const toastOptions: PluginOptions = {
  transition: 'Vue-Toastification__fade',
  timeout: 3000,
  draggable: false,
  hideProgressBar: true,
  icon: false,
  toastClassName: 'toast__class',
  bodyClassName: ['toast__class-body'],
};

const app = createApp(App);
app.use(i18n);
app.use(Toast, toastOptions);
app.use(store);
app.use(router);
app.use(SentryPlugin);
app.component('feather-icon', VueFeather);
app.directive('clickOut', clickOutside);
app.directive('regexp-validate', regexpValidate);
app.mount('#app');

app.config.globalProperties.$toast = useToast();
app.config.globalProperties.$copyText = useClipboard();
