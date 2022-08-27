import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { FileHelper } from 'src/app/helpers/FileHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'
import * as _ from 'lodash'
interface ItemData {
  id: number
  name: string
  phoneNumber: string
  idCard: string
  checked: boolean
  sex: string
  gkcs: string
  trades: string
  gzdw: string
  totalNum: string
  hsPos?: any[]
  yjcs: string
  jcTime: string
  addr: string
  color: number
}

@Component({
  selector: 'app-main-detail',
  templateUrl: './main-detail.component.html',
  styleUrls: ['./main-detail.component.less'],
})
export class MainDetailComponent extends ResultHelper implements OnInit {
  searchForm: FormGroup
  loading = false
  constructor(
    private router: Router,
    private main: MainService,
    private fileHelper: FileHelper,
    private dateHelper: DateHelper,
    message: NzMessageService,
    private fb: FormBuilder
  ) {
    super(message)
  }
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}
  listOfData: ItemData[] = []

  startEdit(id: number): void {
    this.editCache[id].edit = true
  }

  cancelEdit(id: number): void {
    const index = this.listOfData.findIndex(item => item.id === id)
    if (id < 0) {
      this.editCache[id] = {
        data: { ...this.listOfData[index] },
        edit: false,
      }
      this.listOfData = this.listOfData.filter(item => item.id !== id)
    } else {
      this.editCache[id] = {
        data: { ...this.listOfData[index] },
        edit: false,
      }
    }
  }

  async saveEdit(id: number) {
    const index = this.listOfData.findIndex(item => item.id === id)
    let data = _.cloneDeep(Object.assign(this.listOfData[index], this.editCache[id].data))
    if (data.id < 0) {
      Reflect.deleteProperty(data, id)
    }
    let [err] = await this.requestHelper(this.main.operationSectorDetail(data))
    if (!err) {
      this.listOfData = this.listOfData.filter(item => item.id !== id)
    }
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      }
    })
  }
  rateArr = []
  async ngOnInit() {
    this.searchForm = this.fb.group({
      name: [null],
      idCard: [null],
      color: [null],
      queryDate: [null],
    })
    let [err, data] = await this.requestHelper(this.main.getRate(), false)
    if (!err) {
      this.rateArr = data
    }
    this.loadData()
  }
  pageObj = {
    page: 1,
    size: 20,
    total: 0,
  }
  search() {
    this.pageObj.page = 1
    this.loadData()
  }
  reset() {
    this.searchForm.reset()
  }
  async loadData() {
    this.loading = true
    try {
      let obj = this.searchForm.value
      let params = { ...obj, ...{ page: this.pageObj.page, size: this.pageObj.size } }
      if (obj.queryDate) {
        params.queryDate = this.dateHelper.formart(obj.queryDate, 'YYYY-MM-DD HH:mm:ss')
      }
      let [err, list] = await this.requestHelper(this.main.getSectorDetails(params))
      if (!err) {
        this.listOfData = list.content || []
        this.pageObj.total = list.totalElements
        this.updateEditCache()
      }
    } catch (error) {
    } finally {
      this.loading = false
    }
  }

  onBack() {
    this.router.navigateByUrl('/mainManage')
  }
  isAllDisplayDataChecked = false
  isIndeterminate = false
  checkAll(event: boolean) {
    this.listOfData.forEach(item => {
      item.checked = !!event
    })
    this.itemCheckedChange()
  }
  itemCheckedChange() {
    this.isAllDisplayDataChecked = this.listOfData.every(item => item.checked)
    this.isIndeterminate = this.listOfData.some(item => item.checked) && !this.isAllDisplayDataChecked
  }
  async deleteRow(id) {
    let [err] = await this.requestHelper(this.main.deleteSectorDetail(id))
    if (!err) {
      this.loadData()
    }
  }
  msgLoading = false
  async sendMsg() {
    this.msgLoading = true
    let data = this.listOfData
      .filter(item => item.checked)
      .map(item => ({ name: item.name, idCard: item.idCard, phoneNumber: item.phoneNumber }))
    await this.requestHelper(this.main.postMsg(data))
    this.msgLoading = false
    this.listOfData.forEach(item => (item.checked = false))
    this.itemCheckedChange()
  }
  downLoading = false
  async exportData() {
    this.downLoading = true
    try {
      let obj = Object.assign({}, this.searchForm.value)
      if (obj.queryDate) {
        obj.queryDate = this.dateHelper.formart(obj.queryDate, 'YYYY-MM-DD HH:mm:ss')
      }
      let data = await this.main.getSectorDetailsExport(obj)
      this.fileHelper.downLoad(data)
    } catch (error) {
    } finally {
      this.downLoading = false
    }
  }

  add() {
    // this.userVisible = true
    // 行内新增
    let id = -1 * Math.floor(Math.random() * 1000 + Math.random() * 1000)
    console.log(id)
    let item = {
      id,
      name: '',
      checked: false,
      phoneNumber: '',
      idCard: '',
      sex: '男',
      gkcs: '',
      trades: '',
      gzdw: '',
      totalNum: '',
      yjcs: '',
      jcTime: '',
      addr: '',
      color: 0,
    }
    this.listOfData = [item].concat(this.listOfData)
    this.editCache[id] = {
      edit: true,
      data: { ...item },
    }
  }
  trackById(index, item) {
    return item.id
  }
}
