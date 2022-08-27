import { Injectable, OnInit } from '@angular/core'
import { TransferState } from '@angular/platform-browser'
import { Store } from '@ngrx/store'
import { isNull } from 'lodash'
import { Init } from '../store/actions/counter.actions'
import { STORE } from '../utils/StateKey'

@Injectable()
export class ClientInit {
  myStore = isNull
  constructor(private state: TransferState, private store: Store<any>) {
    console.log('init.....')
    // this.store.dispatch(Init(res.Mystore.counter || {}))
    // this.store.dispatch(Init({ count: 10 }))
    this.myStore = this.state.get(STORE, null as any)
  }
}
