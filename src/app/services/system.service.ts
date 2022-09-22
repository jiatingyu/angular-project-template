import { Injectable } from '@angular/core'
import { AxiosInstance } from 'axios'
import { Request } from '../helpers/Request'
import { IDepartment, IResource, IResponse, IResponsePage, IRole, IUser, IUserInfo } from '../models/systems'

/** 存储用户系统设置相关的 */
@Injectable({
  providedIn: 'root',
})
export class SystemService {
  request: AxiosInstance
  constructor(private http: Request) {
    this.request = this.http.request
  }
  /** 登录 */
  async login(data): Promise<IResponse<any>> {
    return this.request.post('/user/login', data)
  }

  /** 用户相关 */
  async getUsers(params = {}): Promise<IResponsePage<IUser>> {
    return this.request.get('/user', { params })
  }
  async getUser(id: number): Promise<IResponse<IUser>> {
    return this.request.get('/user', {
      params: { id },
    })
  }

  async operationUser(data: IUser) {
    return this.request.request({
      url: '/user',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteUser(id: number) {
    return this.request.delete(`/user/${id}`)
  }

  /** 角色相关 */

  async getRoles() {
    return this.request.get('/user/role')
  }
  async getRole(id: number) {
    return this.request.get('/user/role', {
      params: { id },
    })
  }

  async operationRole(data: IRole) {
    return this.request.request({
      url: '/user/role',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteRole(id: number) {
    return this.request.delete(`/user/role/${id}`)
  }

  /** 资源相关 */
  async getResources(): Promise<IResponsePage<IResource[]>> {
    return this.request.get('/user/resource', { params: { page: 1, size: 100 } })
  }
  async getResouce(id: number) {
    return this.request.get('/user/resource', {
      params: { id },
    })
  }

  async operationResouce(data: IResource) {
    return this.request.request({
      url: '/user/resource',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteResource(id: number) {
    return this.request.delete(`/user/resource/${id}`)
  }

  // 部门相关
  async getDetapartments(param?: any): Promise<IResponsePage<IDepartment[]>> {
    return this.request.get('/dept', { params: { page: 1, size: 100, ...param } })
  }

  async getDepartmentParents(parentId: number): Promise<IResponsePage<IDepartment[]>> {
    return this.request.get('/dept/parent', { params: { deptId: parentId, page: 1, size: 100 } })
  }
  async getDepartments(parentId: number): Promise<IResponsePage<IDepartment[]>> {
    return this.request.get('/dept', { params: { deptId: parentId, page: 1, size: 100 } })
  }
  async getDepartment(id: number) {
    return this.request.get('/dept', {
      params: { id },
    })
  }

  async operationDepartment(data: IDepartment) {
    return this.request.request({
      url: '/dept',
      method: data.id ? 'put' : 'post',
      data,
    })
  }
  async deleteDepartment(id: number) {
    return this.request.delete(`/dept/${id}`)
  }
}
