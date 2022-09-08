import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
// import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { NzFormTooltipIcon } from 'ng-zorro-antd/form'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { CommonService } from 'src/app/services/common.service'
import { MainService } from 'src/app/services/main.service'
import { areas, citys, privisions, streets } from 'src/app/utils/china-division'
import { isServer } from 'src/app/utils/commonUtil'
import { idCardValidator, phoneValidator } from 'src/app/utils/MyValidators'

/**
 * 用户申报页面
 */

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent extends ResultHelper implements OnInit {
  validateForm!: FormGroup
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  }
  submitLoading = false
  async submitForm() {
    try {
      this.submitLoading = true
      if (this.validateForm.valid) {
        let obj = this.validateForm.value
        obj['rqmdd'] = obj.mdd + '' + obj.mddDetail
        obj['xck'] = obj.xckObj.xck
        obj['xcksj'] = obj.xckObj.xcksj
        obj['xcksb'] = obj.xckObj.xcksb
        obj['openid'] = this.openid
        console.log('submit', this.validateForm.value)
        let [err] = await this.requestHelper(this.main.userRegister(this.validateForm.value))
        if (!err) {
          this.router.navigate(['/register/success'])
        }
      } else {
        let first = false
        for (const i in this.validateForm.controls) {
          if (this.validateForm.controls[i].invalid) {
            if (!first) {
              first = true
              let el = document.getElementById('_' + i)
              el && el.scrollIntoView()
            }
            this.validateForm.controls[i].markAsDirty()
            this.validateForm.controls[i].updateValueAndValidity()
          }
        }
      }
    } catch (error) {
    } finally {
      this.submitLoading = false
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity())
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true }
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true }
    }
    return {}
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault()
  }

  constructor(
    private fb: FormBuilder,
    message: NzMessageService,
    private dateHelper: DateHelper,
    private router: Router,
    private active: ActivatedRoute,
    private main: MainService,
    private modal: NzModalService
  ) {
    super(message)
  }
  openid = ''
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      tbdz: [null, [Validators.required]],
      name: [null, [Validators.required]],
      idCard: [null, [Validators.required, idCardValidator]],
      phoneNumber: [null, [Validators.required, phoneValidator]],
      jkmys: [null, [Validators.required]],
      mdd: [null, [Validators.required]],
      // rqmdd: [null],
      mddDetail: [null, [Validators.required]],
      // 行程卡
      xckObj: [null, [Validators.required]],
      dqsy: [null, [Validators.required]],
      zqqr: [null, [Validators.required]],
    })
    console.log(this.validateForm)
    if (!isServer()) {
      let params = this.active.snapshot.queryParams
      if (params) {
        this.openid = params['openid'] || ''
      }
      let registerData = JSON.parse(window.localStorage.getItem('registerData') || null)
      if (registerData) {
        // 提示用户
        this.modal.confirm({
          nzTitle: '提示',
          nzContent: `你想恢复上次离开时保存的数据吗?自动保存时间(${registerData.date})`,
          nzOnOk: () => registerData.data && this.validateForm.patchValue(registerData.data),
          nzOnCancel: () => window.localStorage.removeItem('registerData'),
        })
      }
    }
  }
  pcasVisible = false
  pcasOptions = ['四川省', '乐山市', '犍为县']
  pcasIndex = 0
  openpcas() {
    this.pcasVisible = true
    if (this.pcasOptions.length > 1) {
      this.pcasIndex = this.pcasOptions.length - 1
      this.pcasList = areas(this.pcasOptions[0], this.pcasOptions[1])
      return null
    }
    this.pcasIndex = 0
    this.pcasList = areas(this.pcasOptions[0], this.pcasOptions[1])
    return this.pcasList
  }
  pcasList = []
  handleModelChange(e: number) {
    this.pcasOptions = this.pcasOptions.slice(0, e + 1)
    this.pcasIndex = e
    switch (e) {
      case 0:
        this.pcasList = privisions()
        break
      case 1:
        this.pcasList = citys(this.pcasOptions[0])
        break
      case 2:
        this.pcasList = areas(this.pcasOptions[0], this.pcasOptions[1])
        break
      case 3:
        this.pcasList = streets(this.pcasOptions[0], this.pcasOptions[1], this.pcasOptions[2])
        break
      default:
        this.pcasList = []
        break
    }
    return this.pcasList
  }
  nextPrac(val) {
    if (this.pcasIndex === this.pcasOptions.length - 1) {
      this.pcasOptions.splice(this.pcasIndex, 1, val)

      // this.pcasOptions = this.pcasOptions.concat(val)
      this.handleModelChange(this.pcasIndex + 1)
    } else {
      this.pcasOptions = this.pcasOptions.concat(val)
      this.handleModelChange(this.pcasIndex + 1)
    }
  }
  pcasOk() {
    this.pcasVisible = false
    this.validateForm.patchValue({ mdd: this.pcasOptions.join('') })
  }
  saveDraft() {
    let data = this.validateForm.value
    let obj = {
      date: this.dateHelper.formart(new Date(), 'YYYY-MM-DD HH:mm'),
      data,
    }
    window.localStorage.setItem('registerData', JSON.stringify(obj))
    this.message.success('保存成功！！')
  }
}
