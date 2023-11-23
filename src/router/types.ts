import { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/store/types';

export interface Context {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
  store: Store<RootState>
}

export type MiddlewareReturnValue = boolean | void | RouteLocationRaw;

export type Middleware = (context: Context) =>
  MiddlewareReturnValue | Promise<MiddlewareReturnValue>;

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    middleware?: Middleware[]
    title?: string;
  }
}
