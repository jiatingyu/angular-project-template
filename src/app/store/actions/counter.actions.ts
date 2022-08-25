import { createAction, props } from '@ngrx/store'

export const increment = createAction('increment')
export const increment_async = createAction('increment_async', props<{ num: number }>())
export const increment_num = createAction('increment_num', props<{ num: number }>())
export const decrement = createAction('decrement')
export const decrement_num = createAction('decrement_num', props<{ num: number }>())
