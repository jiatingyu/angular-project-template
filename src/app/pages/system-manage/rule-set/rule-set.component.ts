import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { getCurrentUser } from 'src/app/helpers/local-storage.service'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { SystemHelper, TreeNodeInterface } from 'src/app/helpers/SystemHelper'
import { IResource } from 'src/app/models/systems'
import { MainService } from 'src/app/services/main.service'
import { SystemService } from 'src/app/services/system.service'

@Component({
  selector: 'app-rule-set',
  templateUrl: './rule-set.component.html',
  styleUrls: ['./rule-set.component.less'],
})
export class RuleSetComponent extends ResultHelper implements OnInit {
  resourceLoading: boolean = false
  validateForm: FormGroup
  resourceVisible: boolean = false
  // 父级资源
  parentResources = []
  constructor(
    private fb: FormBuilder,
    private system: SystemService,
    private main: MainService,
    message: NzMessageService,
    private systemHelper: SystemHelper
  ) {
    super(message)
  }
  submitForm() {}
  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, Validators.required],
      day: [null, Validators.required],
      num: [null, Validators.required],
      time: [null, Validators.required],
      description: [null, Validators.required],
    })
    this.loadData()
  }
  async loadData() {
    this.resourceLoading = true
    try {
      let [err, data] = await this.requestHelper(this.main.getConfig())
      this.listOfMapData = data
    } catch (error) {
      console.dir(error)
    } finally {
      this.resourceLoading = false
    }
  }

  editObj = null
  edit(item, e: Event) {
    this.editObj = item
    e.preventDefault()
    let arr = item.cron.split(',')
    let day = arr[0].match(/(\d+)/)[0]
    let num = arr[1].match(/(\d+)/)[0]
    let time = arr[2].match(/(\d+)/)[0]
    this.validateForm.get('name').setValue(item.name || null)
    this.validateForm.get('day').setValue(day || null)
    this.validateForm.get('num').setValue(num || null)
    this.validateForm.get('time').setValue(time || null)
    this.validateForm.get('description').setValue(item.description || null)
    this.resourceVisible = true
  }
  add() {
    this.editObj = null
    this.validateForm.reset()
    this.resourceVisible = true
  }
  async addHandle() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
    if (this.validateForm.valid) {
      let obj = { ...this.validateForm.value }
      obj['type'] = getCurrentUser().userType
      obj['cron'] = `D${obj.day},R${obj.num},H${obj.time}`
      if (this.editObj) {
        obj['id'] = this.editObj.id
      }
      await this.requestHelper(this.main.operationConfig(obj))
      this.loadData()
      this.resourceVisible = false
    }
  }
  async delete(id) {
    let [error] = await this.requestHelper(this.main.deleteConfig(id))
    if (!error) {
      this.loadData()
    }
  }

  listOfMapData = []
}
