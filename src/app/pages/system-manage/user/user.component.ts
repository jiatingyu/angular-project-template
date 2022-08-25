import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { Observable } from 'rxjs'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { SystemHelper } from 'src/app/helpers/SystemHelper'
import { IUser } from 'src/app/models/systems'
import { SystemService } from 'src/app/services/system.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class UserComponent extends ResultHelper implements OnInit {
  validateForm: FormGroup
  searchForm: FormGroup
  userVisible = false
  roles = []
  originFormValue = null
  constructor(
    private fb: FormBuilder,
    message: NzMessageService,
    private system: SystemService,
    private systemHelper: SystemHelper
  ) {
    super(message)
  }
  submitForm() {}
  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, Validators.required],
      userType: [1, Validators.required],
      phone: [null, Validators.required],
      sex: ['男', Validators.required],
      roleId: [null, Validators.required],
      deptId: [null, Validators.required],
      account: [null, Validators.required],
      password: [null, Validators.required],
      admin: [0],
    })
    this.searchForm = this.fb.group({
      userName: [null, Validators.required],
      account: [null, Validators.required],
    })
    this.originFormValue = this.validateForm.getRawValue()
    this.init()
  }
  pageObj = {
    page: 1,
    size: 10,
    total: 0,
  }
  async init() {
    let obj = { ...this.pageObj }
    let [err, users] = await this.requestHelper(this.system.getUsers(obj), false)
    let [err1, roles] = await this.requestHelper(this.system.getRoles(), false)
    let [err2, depts] = await this.requestHelper(this.system.getDetapartments(), false)
    if (!err && !err1 && !err2) {
      this.dataSet = users.content
      this.pageObj.total = users.totalElements
      this.roles = roles.content.map(item => ({ id: item.id, roleName: item.roleName }))
      this.departements = this.systemHelper.cascadeResource(depts.content || [])
      this.departements.forEach(item => {
        this.mapDepartments[item.id] = this.systemHelper.convertTreeToList(item)
      })
    }
  }
  async loadData() {
    let obj = { ...this.pageObj, ...this.searchForm.value }
    let [err, users] = await this.requestHelper(this.system.getUsers(obj), false)
    if (!err) {
      this.dataSet = users.content
      this.pageObj.total = users.totalElements
    }
  }
  search() {
    this.pageObj.page = 1
    this.loadData()
  }
  reset() {
    this.searchForm.reset()
  }
  dataSet = []

  add() {
    this.validateForm.reset()
    this.validateForm.patchValue(this.originFormValue)
    this.editObj = null
    this.userVisible = true
  }
  async addHandle() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
    if (this.validateForm.valid) {
      let obj = this.validateForm.value
      this.editObj && (obj['id'] = this.editObj.id)
      let [err] = await this.requestHelper(this.system.operationUser(obj))
      if (!err) {
        this.loadData()
        this.userVisible = false
      }
    }
  }
  editObj = null
  async edit(data) {
    this.editObj = data
    // Object.keys(data).forEach(key => {
    //   this.validateForm.get(key) && this.validateForm.get(key).setValue(data[key])
    // })
    this.validateForm.patchValue(data)
    this.userVisible = true
  }
  async resetPwd(data: IUser) {
    await this.requestHelper(this.system.operationUser({ ...data, password: '123' }))
  }
  async delete(id) {
    let [err] = await this.requestHelper(this.system.deleteUser(id))
    !err && this.loadData()
  }
  // 部门
  departements = []
  mapDepartments = {}
}
