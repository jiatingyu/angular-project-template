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

  // --- 重点人员
  async userRegister(data) {
    return this.request.post('/zdry/anon', data)
  }

  // 重点人员操作
  async getMainDetailsExport(params = {}) {
    return this.request.get('/analysis/zdry/export', { params, responseType: 'blob' })
  }
  async getMainDetails(params = {}) {
    return this.request.get('/zdry', { params })
  }
  async getMainDetail(params = {}) {
    return this.request.get('/zdry', { params })
  }
  async operationMainDetail(data) {
    return this.request.request({
      url: '/zdry',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteMainDetail(id) {
    return this.request.delete(`/zdry/${id}`)
  }
  // 获取重点人员频次
  async getMainRate(params = {}) {
    return this.request.get('/zdry/rule', { params })
  }
  // 分配部分
  async putDistributeDept(data) {
    return this.request.put('/zdry/batch', data)
  }

  // hazard 地区

  async getHazards(data) {
    return this.request.get('/fxdq', data)
  }
  async getHazard(params) {
    return this.request.get('/fxdq', {
      params,
    })
  }
  async operationHazards(data) {
    return this.request({
      url: '/fxdq',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteHazards(id: number) {
    return this.request.delete(`/fxdq/${id}`)
  }

  // 检测数量
  async getJcsl(params) {
    return this.request.get(`/analysis/jcsl`, { params })
  }

  // --- 审批

  async getModelList(params) {
    return this.request.get(`/activity/list`, { params })
  }
  async deleteModel(id) {
    return this.request.delete(`/activity/remove/${id}`)
  }
  async deployModel(id) {
    return this.request.get(`/activity/deploy/${id}`)
  }
  async getdeployList() {
    return this.request.get(`/activity/deployList`)
  }

  async getOwnerTask(deptId: number) {
    return this.request.get(`/activity/task`, {
      params: { deptId },
    })
  }
  async startFlow() {
    return this.request.get(`/activity/start`)
  }
  async doTask(data: { taskId: number; flag: number; comment: string }[]) {
    return this.request.post(`/activity/doTask`, data)
  }
  // 发起流程
  async postWorkFlow(data) {
    // return this.request.post(`/workFlow`, data)
    return this.request.post(`/workFlow/batch`, data)
  }
  async getWorkFlow() {
    return this.request.get(`/workFlow`)
  }

  // 管控设置

  async deleteConfig(id) {
    return this.request.delete(`/config/rule/${id}`)
  }
  async getConfig(params?) {
    return this.request.get(`/config/rule`, params)
  }
  async postConfig(data) {
    return this.request.post(`/config/rule`, data)
  }
  async operationConfig(data) {
    return this.request({
      url: '/config/rule',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
}
