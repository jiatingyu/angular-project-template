import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppState } from '..'
import { counterFeatureKey, CounterState } from '../reducers/counter.reducer'

export const selectCounter = createFeatureSelector<AppState, CounterState>(counterFeatureKey)
export const selectCount = createSelector(selectCounter, state => state.count)
