import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { LocalStorageService } from 'src/app/helpers/local-storage.service'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { IUser } from 'src/app/models/systems'
import { SystemService } from 'src/app/services/system.service'

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.less'],
})
export class PersonComponent extends ResultHelper implements OnInit {
  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private storage: LocalStorageService,
    message: NzMessageService
  ) {
    super(message)
  }
  user: IUser
  validateForm: FormGroup
  userVisible = false
  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, Validators.required],
      phone: [null, Validators.required],
      sex: ['男', Validators.required],
      // account: [null, Validators.required],
      password: [null, Validators.required],
    })
    this.loadData()
  }
  loadData() {
    let user = this.storage.getObject('userInfo') as IUser
    this.getUser(user.id)
  }
  async getUser(id: number) {
    try {
      let [err, data] = await this.requestHelper(this.systemService.getUser(id))
      this.user = data.content[0] || {}
    } catch (error) {}
  }
  edit() {
    this.userVisible = true
    this.validateForm.patchValue(this.user)
  }
  async addHandle() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
    if (this.validateForm.valid) {
      let form = this.validateForm.value
      let paramObj = { ...this.user, ...form }
      let [err] = await this.requestHelper(this.systemService.operationUser(paramObj))
      if (!err) {
        this.loadData()
        this.userVisible = false
      }
    }
  }
}
