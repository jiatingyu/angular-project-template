import { Component, OnInit } from '@angular/core'
import * as echarts from 'echarts'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
})
export class AnalysisComponent extends ResultHelper implements OnInit {
  date = new Date()
  systemInfo = {
    hyry: 0,
    zdry: 0,
    xtrs: 0,
    dxfs: 0,
  }
  isSpinning = false
  constructor(private _date: DateHelper, message: NzMessageService, private mainService: MainService) {
    super(message)
  }
  onChange(date) {
    console.log(date)
    this.init(date)
  }
  ngOnInit() {
    this.init(this.date)
  }
  async init(date = new Date()) {
    let [err, systemInfo] = await this.requestHelper(this.mainService.getSystemInfo(), false)
    this.systemInfo = systemInfo
    let res = await this.loadData()
    let mainData = {
        drsj: 0,
        dzsj: 0,
        dysj: 0,
      },
      sectorData = { drsj: 0, dzsj: 0, dysj: 0 }
    if (res) {
      ;[mainData, sectorData] = res
      this.isSpinning = false
      var myChart = echarts.init(document.getElementById('main'))
      var sectorChart = echarts.init(document.getElementById('sector'))
      // 绘制图表
      let option = {
        title: {
          text: `${this._date.formart(this.date)}-行业常态化检测`,
          textStyle: {
            color: 'white',
          },
        },
        tooltip: {},
        xAxis: {
          data: [this._date.formart(this.date), '本周人数', '本月人数'],
        },
        yAxis: {},
        textStyle: {
          color: 'white',
        },
        series: [
          {
            name: '监测人次',
            type: 'bar',
            data: [sectorData.drsj, sectorData.dzsj, sectorData.dysj],
          },
        ],
      }
      let option2 = {
        title: {
          text: `${this._date.formart(this.date)}-管控重点化监测`,
          textStyle: {
            color: 'white',
          },
        },
        tooltip: {},
        xAxis: {
          data: [this._date.formart(this.date), '本周人数', '本月人数'],
        },
        yAxis: {},
        textStyle: {
          color: 'white',
        },
        series: [
          {
            name: '监测人次',
            type: 'bar',
            data: [mainData.drsj, mainData.dzsj, mainData.dysj],
          },
        ],
      }
      myChart.setOption(option)
      sectorChart.setOption(option2)
    }
  }
  async loadData() {
    this.isSpinning = true
    let date = this._date.formart(this.date, 'YYYY-MM-DD HH:mm:ss')
    // this.requestHelper(this.mainService.getSystemInfo())
    let [err, data] = await this.requestHelper(this.mainService.getMainAnalysis({ date }), false)
    let [err1, data1] = await this.requestHelper(this.mainService.getSectorAnalysis({ date }), false)
    if (!err && !err1) {
      return [data[0] || {}, data1[0] || {}]
    }
    this.isSpinning = false
    return null
  }
}
