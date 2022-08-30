import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'

@Component({
  selector: 'app-hazard-area',
  templateUrl: './hazard-area.component.html',
  styleUrls: ['./hazard-area.component.less'],
})
export class HazardAreaComponent extends ResultHelper implements OnInit {
  validateForm: FormGroup
  searchForm: FormGroup
  userVisible = false
  roles = []
  originFormValue = null
  constructor(private fb: FormBuilder, message: NzMessageService, private main: MainService) {
    super(message)
  }
  submitForm() {}
  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, Validators.required],
      grade: [null, Validators.required],
    })
    // this.searchForm = this.fb.group({
    //   userName: [null, Validators.required],
    //   account: [null, Validators.required],
    // })
    this.originFormValue = this.validateForm.getRawValue()
    this.loadData()
  }
  pageObj = {
    page: 1,
    size: 10,
    total: 0,
  }
  async loadData() {
    let obj = { ...this.pageObj }
    let [err, users] = await this.requestHelper(this.main.getHazards(obj), false)
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
      let [err] = await this.requestHelper(this.main.operationHazards(obj))
      if (!err) {
        this.loadData()
        this.userVisible = false
      }
    }
  }
  editObj = null
  async edit(data) {
    this.editObj = data
    this.validateForm.patchValue(data)
    this.userVisible = true
  }
  async delete(id) {
    let [err] = await this.requestHelper(this.main.deleteHazards(id))
    !err && this.loadData()
  }
}
