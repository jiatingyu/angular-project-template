import { Action, createReducer, on } from '@ngrx/store'
import { decrement, decrement_num, increment, increment_num, Init } from '../actions/counter.actions'
// 唯一标示
export const counterFeatureKey = 'counter'

export interface CounterState {
  count: number
}

export const initialState: CounterState = {
  count: 0,
}

export const reducer = createReducer(
  initialState,
  on(increment, state => {
    return { ...state, count: state.count + 1 }
  }),
  on(increment_num, (state, action) => {
    return { ...state, count: state.count + action.num }
  }),
  on(decrement, state => {
    return { ...state, count: state.count - 1 }
  }),
  on(decrement_num, (state, action) => {
    return { ...state, count: state.count - action.num }
  }),
  on(Init, (state, action) => {
    return action
  })
)
