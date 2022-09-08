import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'

@Component({
  selector: 'app-analysis-org',
  templateUrl: './analysis-org.component.html',
  styleUrls: ['./analysis-org.component.less'],
})
export class AnalysisOrgComponent extends ResultHelper implements OnInit {
  constructor(message: NzMessageService, private main: MainService, private dateHelper: DateHelper, private fb: FormBuilder) {
    super(message)
  }
  dataSet = []
  searchForm: FormGroup
  ngOnInit(): void {
    this.loadData()
    this.searchForm = this.fb.group({
      date: [null],
    })
  }
  async loadData() {
    let vals = this.searchForm.value
    let obj = {}
    if (vals.date) {
      obj['startDate'] = this.dateHelper.formart(vals.date[0], 'YYYY-MM-DD HH:mm:ss')
      obj['endDate'] = this.dateHelper.formart(vals.date[1], 'YYYY-MM-DD HH:mm:ss')
    }

    let [err, data] = await this.requestHelper(this.main.getJcsl(obj))
    if (!err) {
      console.log(data)
      this.dataSet = data
    }
  }
}
