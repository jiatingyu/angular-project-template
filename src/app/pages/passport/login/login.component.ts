import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'
import { LocalStorageService } from 'src/app/helpers/local-storage.service'
import { SystemService } from 'src/app/services/system.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup
  loading = false
  async submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
    if (this.validateForm.valid) {
      this.loading = true
      try {
        let { meta, data } = await this.system.login(this.validateForm.value)
        if (meta.success) {
          this.storage.set('access_token', data.access_token)
          this.storage.setObject('userInfo', data.userInfo)
          this.router.navigate([''])
        } else {
          this.message.error(meta.message)
        }
      } catch (error) {
        this.message.warning(error.message)
      } finally {
        this.loading = false
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private system: SystemService,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      // account: ['xzl', [Validators.required]],
      // password: ['123456', [Validators.required]],
      account: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true],
    })
  }
}
