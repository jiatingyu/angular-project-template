import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DateHelper } from 'src/app/helpers/DateHelper'
import { FileHelper } from 'src/app/helpers/FileHelper'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'
import * as _ from 'lodash'
import { SystemService } from 'src/app/services/system.service'
import { getCurrentUser, LocalStorageService } from 'src/app/helpers/local-storage.service'
import { SystemHelper } from 'src/app/helpers/SystemHelper'
interface ItemData {
  id: number
  deptId?: number
  deptVo?: { name: '' }
  cjxxrq?: string
  xxly?: string
  rqmdd?: string
  gkz?: string
  xckgj?: string
  qfxd?: string
  dqsj?: string
  rylx?: string
  zqjzc?: string
  jkmys?: string
  hcryjdh?: string
  gkdd?: string
  gksj?: string
  gkzrr?: string
  hszm?: string
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

  dychssj?: string
  dechssj?: string
  dschssj?: string
  dsichssj?: string
  dwchssj?: string
  jcgkry?: string
  remark?: string
  jcgksj?: string
  ldshyj?: string
  jcgksq?: string
  jcgkyj?: string
  xck?: string
  xcksb?: string
  dqsy?: string
}

const getDeparamentParent = data => {
  let index = 0
  let res = []
  function arr(data) {
    if (!data) return
    if (data.parent) {
      arr(data.parent)
    }
    data.level = index++
    // data.name = Math.random() * 100
    res.push(data)
    return data
  }
  data && arr(data.parent)
  return res
}

@Component({
  selector: 'app-main-detail',
  templateUrl: './main-detail.component.html',
  styleUrls: ['./main-detail.component.less'],
})
export class MainDetailComponent extends ResultHelper implements OnInit {
  searchForm: FormGroup
  loading = false
  uri = window['env']['url']
  // 管控措施
  rateArr = []
  constructor(
    private router: Router,
    private main: MainService,
    private fileHelper: FileHelper,
    private dateHelper: DateHelper,
    message: NzMessageService,
    private system: SystemService,
    private systemHelper: SystemHelper,
    private fb: FormBuilder,
    private active: ActivatedRoute
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
    data.gksj = this.dateHelper.formart(data.gksj, 'YYYY-MM-DD HH:mm:ss')
    if (data.id < 0) {
      Reflect.deleteProperty(data, 'id')
    }
    let [err] = await this.requestHelper(this.main.operationMainDetail(data))
    if (!err) {
      this.listOfData = this.listOfData.filter(item => item.id !== id)
      this.loadData()
    } else {
      this.message.error(err)
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
  // 部门
  departements = []
  mapDepartments = {}
  parentDepartments = []
  templates = {
    datas: [],
    map: {},
  }
  async ngOnInit() {
    let params = this.active.snapshot.queryParams
    let rangeDate = []
    // 获取外部时间
    if (params && params['date']) {
      rangeDate[0] = new Date(params['date'])
      rangeDate[1] = new Date()
    }
    this.searchForm = this.fb.group({
      name: [null],
      idCard: [null],
      color: [null],
      queryDate: [null],
    })
    this.manageForm = this.fb.group({
      gkcs: [null, Validators.required],
      template: [null, Validators.required],
      content: [null, Validators.required],
      second: [null, Validators.required],
      third: [null, Validators.required],
    })
    let deptId = getCurrentUser().deptId
    let [err1, data1] = await this.requestHelper(this.system.getDepartments(deptId), false)
    let [err3, data2] = await this.requestHelper(this.system.getDepartmentParents(deptId), false)
    let [err4, data4] = await this.requestHelper(this.main.getdeployList(), false)
    let [err, data] = await this.requestHelper(this.main.getMainRate(), false)
    if (!err && !err1) {
      this.rateArr = data
      // 子孙部门
      this.departements = this.systemHelper.cascadeResource(data1.content || [])
      this.departements.forEach(item => {
        this.mapDepartments[item.id] = this.systemHelper.convertTreeToList(item)
      })
      // 父级部门
      this.parentDepartments = getDeparamentParent(data2)
      let objMap = {
        datas: [],
        map: {},
      }
      data4.map(item => {
        objMap.datas.push(item)
        objMap.map[item.deploymentId] = item
      })
      this.templates = objMap
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
      let [err, list] = await this.requestHelper(this.main.getMainDetails(params))
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
  getCheckedData(): any[] {
    return this.listOfData.filter(item => item.checked)
  }
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
    let [err] = await this.requestHelper(this.main.deleteMainDetail(id))
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
      let data = await this.main.getMainDetailsExport(obj)
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
  //
  deptVisible = false

  distributeDept = ''
  openDistribute() {
    this.deptVisible = true
  }
  async distributeDeptOK() {
    if (!this.distributeDept) {
      this.deptVisible = false
      return
    }
    let checkedData = this.listOfData.filter(item => item.checked).map(item => ({ id: item.id, deptId: this.distributeDept }))
    // this.
    let [err] = await this.requestHelper(this.main.putDistributeDept(checkedData))
    if (!err) {
      this.listOfData.filter(item => item.checked).forEach(item => (item.checked = false))
      this.deptVisible = false
      this.loadData()
      return
    }
    this.message.error(err)
  }

  // 解除管控
  manageForm: FormGroup
  manageVisible = false
  openManage() {
    if (!this.getCheckedData().every(item => item.deptId)) {
      this.message.waring('选择的人员中有未分配部门的人员')
      return
    }
    this.manageVisible = true
  }
  manageOkLoading = false
  async handleManage() {
    this.manageOkLoading = true
    for (const i in this.manageForm.controls) {
      this.manageForm.controls[i].markAsDirty()
      this.manageForm.controls[i].updateValueAndValidity()
    }
    let values = this.manageForm.value
    console.log(values)
    if (this.manageForm.valid) {
      let user = getCurrentUser()
      let data = this.getCheckedData().map(item => {
        let obj = {
          content: values.content,
          deployId: values.template,
          deployName: this.templates.map[values.template].name,
          deptId: item.deptId,
          deptName: item.deptVo.name,
          idCard: item.idCard,
          name: item.name,
          gkcs: values.gkcs,
          param: {
            currentUser: item.deptId,
            secondUser: values.second,
            thirdUser: values.third,
          },
          userId: user.id,
          userName: user.userName,
        }
        return obj
      })
      let [err] = await this.requestHelper(this.main.postWorkFlow(data))
      if (!err) {
        this.manageVisible = false
        this.loadData()
      }
    }
    this.manageOkLoading = false
  }
}
