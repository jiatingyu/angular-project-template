import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store'
import { environment } from '../../environments/environment'
import * as fromCounter from './reducers/counter.reducer'
import * as fromRouter from '@ngrx/router-store'
import { inject, InjectionToken } from '@angular/core'
import { AppServerModule } from '../app.server.module'
import { isServer } from '../utils/commonUtil'
export interface AppState {
  [fromCounter.counterFeatureKey]: fromCounter.CounterState
  router: fromRouter.RouterReducerState
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  [fromCounter.counterFeatureKey]: fromCounter.reducer,
}

function intercepter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    // console.log('state:', state)
    // console.log('action:', action)
    return reducer(state, action)
  }
}
// action -> reducer中间处理函数  相当于拦截器
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [intercepter] : []
