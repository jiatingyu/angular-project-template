import { Injectable } from '@angular/core'
import { AxiosInstance } from 'axios'
import { Request } from '../helpers/Request'
import { IResponsePage, UserType } from '../models/systems'

/** 主要业务 */

@Injectable({
  providedIn: 'root',
})
export class MainService {
  request: AxiosInstance
  constructor(private http: Request) {
    this.request = this.http.request
  }
  /** 短信 */
  async getMessageTemp() {
    return this.request.get('/log/sms/template')
  }
  async getMessageLog(params): Promise<IResponsePage<any>> {
    return this.request.get('/log/smsLog', { params })
  }
  // 获取系统信息
  async getSystemInfo(params = {}) {
    return this.request.get('/analysis/user', { params })
  }

  // 管控人员 统计
  async getMainAnalysisDetail(params = {}) {
    return this.request.get('/analysis', { params: { ...params, type: UserType.重点管控用户 } })
  }

  // 行业人员 统计
  async getSectorAnalysisDetail(params = {}) {
    return this.request.get('/analysis', { params: { ...params, type: UserType.行业用户 } })
  }
  // 获取频次
  async getRate(params = {}) {
    return this.request.get('/hyry/rule', { params })
  }
  // 行业详情操作
  async getSectorDetailsExport(params = {}) {
    return this.request.get('/analysis/export', { params, responseType: 'blob' })
  }
  async getSectorDetails(params = {}) {
    return this.request.get('/hyry', { params })
  }
  async getSectorDetail(params = {}) {
    return this.request.get('/hyry', { params })
  }
  async operationSectorDetail(data) {
    return this.request.request({
      url: '/hyry',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteSectorDetail(id) {
    return this.request.delete(`/hyry/${id}`)
  }

  // 管控人员 汇总
  async getMainAnalysis(params = {}) {
    return this.request.get('/analysis/sum', { params: { ...params, type: UserType.重点管控用户 } })
  }

  // 行业人员 汇总
  async getSectorAnalysis(params = {}) {
    return this.request.get('/analysis/sum', { params: { ...params, type: UserType.行业用户 } })
  }

  // 发送短信
  async postMsg(data) {
    return this.request.post('/sms', data)
  }
}
