import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { timer } from 'rxjs';
import { map, mapTo, mergeMap, tap } from 'rxjs/operators';
import {
  increment,
  increment_async,
  increment_num,
} from '../actions/counter.actions';

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions) {
    // this.actions$.subscribe(v => console.log(v))
  }
  loadCount = createEffect(() => {
    return this.actions$.pipe(
      ofType(increment_async),
      tap((v) => console.log(v)),
      // mergeMap(v => timer(2000).pipe(map(() => increment_num({ num: v.num }))))
      mergeMap((v) => timer(2000).pipe(mapTo(increment_num({ num: v.num }))))
    );
  });
}
