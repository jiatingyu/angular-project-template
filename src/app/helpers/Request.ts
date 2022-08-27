import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import axios, { AxiosInstance } from 'axios'
import { NzMessageService } from 'ng-zorro-antd/message'
import { environment } from 'src/environments/environment'
import { storage } from './local-storage.service'
import { PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { isServer } from '../utils/commonUtil'

export const baseURL = typeof window === 'undefined' ? environment.url : window['env']['url']
@Injectable({
  providedIn: 'root',
})
export class Request {
  request: AxiosInstance
  notAuthRequest = [
    // 登录
    '/user/login',
  ]
  // baseURL = ''
  constructor(private message: NzMessageService, private router: Router, @Inject(PLATFORM_ID) private plateformId) {
    // if (isPlatformServer(plateformId)) {
    //   this.baseURL = environment.url
    // } else {
    //   this.baseURL = window['env']['url']
    // }
    this.request = axios.create({
      // baseURL: this.baseURL,
      baseURL,
      timeout: 10 * 10000,
    })
    this.request.interceptors.request.use(config => {
      // if(isServer()){
      console.log('config.url:', config.url)
      // }
      if (!this.notAuthRequest.includes(config.url)) {
        let access_token = storage.get('access_token')
        access_token && (config.headers['access_token'] = access_token)
      }
      return config
    })

    this.request.interceptors.response.use(
      config => {
        // let contentType = config.headers['content-type'].match(/(ynd.ms-excel)/)
        let cont = config.headers['content-disposition']
        if (cont) {
          // 说明是下载
          return config
        }
        if (config.status === 200) {
          return config.data
        }
      },
      error => {
        let { response } = error
        if (response && response.status === 401) {
          storage.removeAll()
          this.message.error('当前身份未认证')
          // location.pathname = '/passport'
          this.router.navigate(['/passport'])
        } else {
          Promise.reject(error)
        }
      }
    )
  }
}
