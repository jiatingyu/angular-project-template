import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { extend } from 'lodash'
import { NzMessageService } from 'ng-zorro-antd/message'
import { getCurrentUser } from 'src/app/helpers/local-storage.service'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'
@Component({
  selector: 'app-flow-operation',
  templateUrl: './flow-operation.component.html',
  styleUrls: ['./flow-operation.component.less'],
})
export class FlowOperationComponent extends ResultHelper implements OnInit {
  searchForm: FormGroup
  checkForm: FormGroup
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, message: NzMessageService, private main: MainService) {
    super(message)
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [null],
    })
    this.checkForm = this.fb.group({
      flag: [null, Validators.required],
      comment: [null, Validators.required],
    })
    this.loadData()
  }
  pageObj = {
    page: 1,
    size: 20,
    total: 0,
  }
  dataSet = []
  loading = false
  async loadData() {
    this.loading = true
    let user = getCurrentUser()
    // let obj = {...this.pageObj,deptId : user.deptId}
    let [err, data] = await this.requestHelper(this.main.getOwnerTask(user.deptId), false)
    if (!err) {
      this.dataSet = data || []
      // this.pageObj.total = data.totalElements
    }
    this.loading = false
  }
  check() {
    // if(!this.getCheckData().length){
    //   this.message.waring('审核用户不能为空')
    //   return
    // }
    this.checkVisible = true
  }
  async delete(data) {
    let [err] = await this.requestHelper(this.main.deleteModel(data.id))
    if (!err) this.loadData()
  }
  checkVisible = false
  async handleCheck() {
    for (const i in this.checkForm.controls) {
      this.checkForm.controls[i].markAsDirty()
      this.checkForm.controls[i].updateValueAndValidity()
    }
    let values = this.checkForm.value
    let arr = this.getCheckData().map(item => {
      let obj = { ...values, taskId: item.id, userName: getCurrentUser().userName }
      return obj
    })
    if (this.checkForm.valid) {
      let [err] = await this.requestHelper(this.main.doTask(arr))
      if (!err) {
        this.loadData()
      }
      this.checkVisible = false
    }
  }

  isAllDisplayDataChecked = false
  isIndeterminate = false
  getCheckedData(): any[] {
    return this.dataSet.filter(item => item.checked)
  }
  checkAll(event: boolean) {
    this.dataSet.forEach(item => {
      item.checked = !!event
    })
    this.itemCheckedChange()
  }
  itemCheckedChange() {
    this.isAllDisplayDataChecked = this.dataSet.every(item => item.checked)
    this.isIndeterminate = this.dataSet.some(item => item.checked) && !this.isAllDisplayDataChecked
  }
  getCheckData() {
    return this.dataSet.filter(item => item.checked)
  }
}
