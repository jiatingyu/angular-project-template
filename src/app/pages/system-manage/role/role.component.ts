import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { SystemHelper } from 'src/app/helpers/SystemHelper'
import { SystemService } from 'src/app/services/system.service'

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less'],
})
export class RoleComponent extends ResultHelper implements OnInit {
  validateForm: FormGroup
  roleVisible = false
  // 默认选中的项目
  defaultChecked = []
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent
  resources = []
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
      roleName: [null, Validators.required],
      status: [1, Validators.required],
    })
    this.loadData()
  }
  async loadData() {
    let [err, resouceData] = await this.requestHelper(this.system.getResources(), false)
    let [err1, roleData] = await this.requestHelper(this.system.getRoles())
    if (!err && !err1) {
      this.resources = this.systemHelper.cascadeResource(resouceData.content || [])
      this.dataSet = roleData.content
    }
  }
  dataSet = []
  add() {
    this.editObj = null
    this.defaultChecked = []
    this.validateForm.reset()
    this.validateForm.get('status').setValue(1)
    this.roleVisible = true
  }
  async addHandle() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
    if (this.validateForm.valid) {
      let nodes = this.nzTreeComponent.getCheckedNodeList()
      let ids = []
      const deepIds = node => {
        if (!node) return
        node.forEach(item => {
          ids.push({ id: item.key })
          if (item.children) {
            deepIds(item.children)
          }
        })
      }
      deepIds(nodes)
      let obj = { ...this.validateForm.value, ...{ resourceVos: ids } }
      if (this.editObj) {
        obj['id'] = this.editObj.id
      }
      let [err] = await this.requestHelper(this.system.operationRole(obj))
      if (!err) {
        this.roleVisible = false
        this.loadData()
      }
    }
  }
  editObj = null
  edit(data) {
    this.editObj = data
    this.validateForm.patchValue(data)
    this.defaultChecked = data.resourceVos.map(item => item.id)
    this.roleVisible = true
  }
  async delete(id) {
    let [err] = await this.requestHelper(this.system.deleteRole(id))
    !err && this.loadData()
  }
}
