import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'

@Component({
  selector: 'app-main-mange',
  templateUrl: './main-mange.component.html',
  styleUrls: ['./main-mange.component.less'],
})
export class MainMangeComponent extends ResultHelper implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mainService: MainService,
    message: NzMessageService,
    private dateHelper: DateHelper
  ) {
    super(message)
  }
  searchForm: FormGroup
  searchFormPanel: FormGroup
  date = new Date()
  datePanel = [new Date(), new Date()]
  listOfData = []
  loading = false
  panelLoading = false
  ngOnInit() {
    this.searchForm = this.fb.group({
      date: [this.date],
    })
    this.searchFormPanel = this.fb.group({
      date: [this.datePanel],
    })
    this.loadDataPanel()
    this.loadData()
  }
  analysisObj = {
    wait: 0,
    normal: 0,
    waitHandle: 0,
    waring: 0,
    other: 0,
  }
  async loadDataPanel() {
    try {
      this.panelLoading = true
      let obj = {
        queryDate: this.dateHelper.formart(this.datePanel[0], 'YYYY-MM-DD HH:mm:ss'),
        queryEndDate: this.dateHelper.formart(this.datePanel[1], 'YYYY-MM-DD HH:mm:ss'),
      }
      let [err, data] = await this.requestHelper(this.mainService.getMainDetailsPanel(obj))
      if (!err) {
        this.listOfData = data || {}
        let [wait, normal, waitHandle, waring, other] = Object.values(data || {}) as number[]
        this.analysisObj = { wait, normal, waitHandle, waring, other }
      } else {
        this.listOfData = []
      }
    } catch (error) {
      console.dir(error)
      this.message.error(error.message)
    } finally {
      this.panelLoading = false
    }
  }
  async loadData() {
    try {
      this.loading = true
      let obj = {
        date: this.dateHelper.formart(this.date, 'YYYY-MM-DD HH:mm:ss'),
      }
      let [err, data] = await this.requestHelper(this.mainService.getMainAnalysisDetail(obj))
      if (!err) {
        this.listOfData = data || []
      } else {
        this.listOfData = []
      }
    } catch (error) {
      console.dir(error)
      this.message.error(error.message)
    } finally {
      this.loading = false
    }
  }
  dateFormart() {
    return this.dateHelper.formart(this.date)
  }

  checkUsers() {
    this.router.navigate(['/mainManage/detail'])
  }
  toDetail(val) {
    console.log(val)
    let queryDate = this.dateHelper.formart(this.datePanel[0], 'YYYY-MM-DD HH:mm:ss')
    let queryEndDate = this.dateHelper.formart(this.datePanel[1], 'YYYY-MM-DD HH:mm:ss')
    this.router.navigate(['/mainManage/detail'], { queryParams: { state: val, queryDate, queryEndDate } })
  }
}
