import { Inject, Injectable } from '@angular/core'
@Injectable({
  providedIn: 'root',
})
export class Token {
  name = '张三'
  constructor() {
    console.log('token:.............')
  }
}
