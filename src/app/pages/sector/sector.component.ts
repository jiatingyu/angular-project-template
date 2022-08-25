import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { CommonService } from 'src/app/services/common.service'
import { MainService } from 'src/app/services/main.service'

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.less'],
})
export class SectorComponent extends ResultHelper implements OnInit {
  searchForm: FormGroup
  date = new Date()
  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private router: Router,
    message: NzMessageService,
    private dateHelper: DateHelper
  ) {
    super(message)
  }
  loading = false
  listOfData = []
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
      let [err, data] = await this.requestHelper(this.mainService.getSectorAnalysisDetail(obj))
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
    this.router.navigate(['/sector/detail'])
  }
}
