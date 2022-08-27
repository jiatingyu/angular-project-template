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
  date = new Date()
  listOfData = []
  loading = false
  ngOnInit() {
    this.searchForm = this.fb.group({
      date: [this.date],
    })
    this.loadData()
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
}
