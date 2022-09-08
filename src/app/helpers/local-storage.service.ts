import { Injectable } from '@angular/core'
import { IUserInfo } from '../models/systems'
import { isServer } from '../utils/commonUtil'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  set(key, value) {
    window.localStorage[key] = value
  }
  get(key) {
    return isServer() ? null : window.localStorage[key]
  }
  setObject(key, obj) {
    window.localStorage[key] = JSON.stringify(obj)
  }
  getObject(key) {
    return isServer() ? null : JSON.parse(window.localStorage[key] || 'null')
  }
  remove(key) {
    window.localStorage.removeItem(key)
  }
  removeAll() {
    window.localStorage.clear()
  }
}

let storage = new LocalStorageService()
const getCurrentUser = (): IUserInfo => {
  return storage.getObject('userInfo')
}

export { storage, getCurrentUser }
