import { RouteRecordRaw } from 'vue-router';
import { AppLayout } from '@/layouts/types';
import auth from '@/router/middlewares/auth';
import guest from '@/router/middlewares/guest';
import role from '@/router/middlewares/role';
import register from '@/router/middlewares/register';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      middleware: [guest, auth],
      layout: AppLayout.DEFAULT,
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
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      middleware: [guest, register],
      layout: AppLayout.AUTH,
    },
  },
  {
    path: '/login-by-token/:token',
    name: 'login-by-token',
    component: () => import('@/views/LoginByTokenView.vue'),
    meta: {
      middleware: [guest, register],
      layout: AppLayout.AUTH,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      middleware: [guest, register],
      layout: AppLayout.AUTH,
    },
  },
  {
    path: '/password-reset',
    name: 'reset',
    component: () => import('@/views/ResetPassView.vue'),
    meta: {
      middleware: [guest],
      layout: AppLayout.AUTH,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  //new
  {
    path: '/withdrawal',
    name: 'withdrawal',
    component: () => import('@/views/withdrawalWallet/WithdrawalView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal/:wallet_id',
    name: 'withdrawal-edit',
    component: () => import('@/views/withdrawalWallet/WithdrawalWallet.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal/history',
    name: 'exchange-cold-history',
    component: () => import('@/views/withdrawalWallet/WithdrawalColdWalletHistoryView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal/exchange-setting',
    name: 'exchange-setting',
    component: () => import('@/views/withdrawalWallet/WithdrawalExchangeSettingView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal/exchange-withdrawal',
    name: 'exchange-withdrawal',
    component: () => import('@/views/withdrawalWallet/WithdrawalExchange.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  //old

  {
    path: '/withdrawals',
    name: 'withdrawals',
    component: () => import('@/views/withdrawals/WithdrawalsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawals/:date',
    name: 'withdrawals-transactions',
    component: () => import('@/views/withdrawals/WithdrawalsTransactionsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal-rules',
    name: 'withdrawal-rules',
    component: () => import('@/views/withdrawals/WithdrawalRulesView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal-rules/:wallet_id/settings',
    name: 'wallets-withdrawals-settings',
    component: () => import('@/views/withdrawals/WithdrawalsSettingsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/withdrawal-rules/exchange/:exchange_name/1',
    name: 'withdrawals-exchange-1',
    component: () => import('@/views/exchanges/ExchangeAndWalletsView.vue'),
    // component: () => import('@/views/withdrawals/WithdrawalsExchangeView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal-rules/exchange/:exchange_name/2',
    name: 'withdrawals-exchange-2',
    component: () => import('@/views/exchanges/ExchangeDirectionsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/withdrawal-rules/exchange/:exchange_name/3',
    name: 'withdrawals-exchange-3',
    component: () => import('@/views/exchanges/WalletsDetailsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/stores/create',
    name: 'store-create',
    component: () => import('@/views/stores/CreateStoreView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores/:store_id/settings',
    redirect: (to) => ({
      name: 'store-settings-general',
      params: { store_id: to.params.store_id },
    }),
    name: 'store-settings',
    component: () => import('@/views/storeSettings/StoreSettingsView.vue'),
    children: [
      {
        path: '/stores/:store_id/settings/general',
        name: 'store-settings-general',
        component: () => import('@/views/storeSettings/GeneralView.vue'),
      },
    ],
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores/:store_id/settings/advanced',
    name: 'store-settings-advanced',
    component: () => import('@/views/storeSettings/AdvancedView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores/:store_id/settings/general',
    name: 'store-settings-general',
    component: () => import('@/views/storeSettings/GeneralView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores/:store_id/settings/advanced/webhooks/:webhook_id',
    name: 'store-settings-webhook-item',
    component: () => import('@/views/storeSettings/WebhookItemView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores/:store_id/settings/advanced/webhooks/:webhook_id/test',
    name: 'store-settings-webhook-test',
    component: () => import('@/views/storeSettings/WebhookTestView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/invoices-list',
    name: 'invoices',
    component: () => import('@/views/invoices/InvoicesView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/invoices/:invoice_id',
    name: 'invoice',
    component: () => import('@/views/paymentForm/InvoicePaymentFormView.vue'),
    meta: {
      middleware: [guest, auth],
      layout: AppLayout.PAYMENT,
    },
  },
  {
    path: '/payer/:payer_id',
    name: 'payer',
    component: () => import('@/views/payerForm/PayerFormView.vue'),
    meta: {
      middleware: [guest, auth],
      layout: AppLayout.PAYMENT,
    },
  },
  {
    path: '/stores/invoices/:invoice_id',
    name: 'invoice-details',
    component: () => import('@/views/invoices/InvoiceDetailsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores/invoices/create',
    name: 'invoice-create',
    component: () => import('@/views/invoices/InvoiceCreateView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/stores',
    name: 'stores',
    component: () => import('@/views/stores/StoresView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/balances',
    name: 'balances',
    component: () => import('@/views/balances/BalancesView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/support/search-tx/:tx_id?',
    name: 'support-search-tx',
    component: () => import('@/views/SearchTransactionsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/monitoring',
    name: 'monitoring',
    component: () => import('@/views/monitoring/MonitoringView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/monitoring/service/:service_id',
    name: 'monitoring-service',
    component: () => import('@/views/monitoring/MonitoringServiceView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/balances/:address/invoices',
    name: 'balances-address-invoices',
    component: () => import('@/views/balances/AddressInvoicesView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: false,
    },
  },
  {
    path: '/rates-and-fees',
    name: 'rates-and-fees',
    component: () => import('@/views/RatesAndFeesView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('@/views/VerifyEmailView.vue'),
    meta: {
      middleware: [guest, auth],
      layout: AppLayout.DEFAULT,
    },
  },
  {
    path: '/all-users',
    name: 'all-users',
    component: () => import('@/views/users/UsersView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/all-users/:user_id',
    name: 'all-users-user',
    component: () => import('@/views/users/UserView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/invited-users',
    name: 'invited-users',
    component: () => import('@/views/invitedUsers/InvitedUsersView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
      progressBar: true,
    },
  },
  {
    path: '/invited-users/:id',
    name: 'invited-users-user',
    component: () => import('@/views/invitedUsers/InvitedUserSettingsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/invited-users/invite',
    name: 'invited-users-invite',
    component: () => import('@/views/invitedUsers/InviteUserView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/invite',
    name: 'invite',
    component: () => import('@/views/invitedUsers/AcceptInviteView.vue'),
    meta: {
      middleware: [guest],
      layout: AppLayout.AUTH,
    },
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: () => import('@/views/transfer/TransferView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/root-settings',
    name: 'root-settings',
    component: () => import('@/views/settings/RootSettingsView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/processing-wallet/:blockchain/stats',
    name: 'processing-wallet',
    component: () => import('@/views/processingWallet/ProcessingWalletView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
  {
    path: '/processing-wallet/:blockchain/stats/:date',
    name: 'processing-wallet-detail',
    component: () => import('@/views/processingWallet/ProcessingWalletByDateView.vue'),
    meta: {
      middleware: [auth, role],
      layout: AppLayout.ADMIN,
    },
  },
];
