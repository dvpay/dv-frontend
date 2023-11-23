import { RouteRecordRaw } from 'vue-router';
import { AppLayout } from '@/layouts/types';
import guest from '@/router/middlewares/guest';
import auth from '@/router/middlewares/auth';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/invoices/:invoice_id',
    name: 'invoice',
    component: () => import('@/views/paymentForm/InvoicePaymentFormView.vue'),
    meta: {
      layout: AppLayout.PAYMENT,
    },
  },
  {
    path: '/invoices/payer/:payer_id',
    name: 'payer',
    component: () => import('@/views/payerForm/PayerFormView.vue'),
    meta: {
      middleware: [guest, auth],
      layout: AppLayout.PAYMENT,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'page-not-found',
    component: () => import('@/views/PageNotFoundView.vue'),
    meta: {
      layout: AppLayout.DEFAULT,
    },
  },
];
