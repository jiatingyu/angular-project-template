import { Component, OnInit } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.less'],
})
export class MessageTemplateComponent extends ResultHelper implements OnInit {
  Templates = []
  Logs = []
  constructor(message: NzMessageService, private mainService: MainService) {
    super(message)
  }

  ngOnInit() {
    this.loadData()
  }
  pageObj = {
    page: 1,
    size: 10,
    total: 0,
  }
  async loadData() {
    let [err, temps] = await this.requestHelper(this.mainService.getMessageTemp(), false)
    this.historyData()
    if (!err) {
      this.Templates = temps.content || []
    }
  }
  async historyData() {
    let obj = { page: this.pageObj.page, size: this.pageObj.size }
    let [err1, logs] = await this.requestHelper(this.mainService.getMessageLog(obj), false)
    if (!err1) {
      this.Logs = logs.content || []
      this.pageObj.total = logs.totalElements
    }
  }
}
