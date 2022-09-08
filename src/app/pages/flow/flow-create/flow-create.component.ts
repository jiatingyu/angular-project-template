import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { extend } from 'lodash'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { MainService } from 'src/app/services/main.service'
class Dep {
  id // 订阅池
  subs
  static watch
  constructor() {
    this.id = new Date() //这里简单的运用时间戳做订阅池的ID
    this.subs = [] //该事件下被订阅对象的集合
  }
  defined() {
    // 添加订阅者
    Dep.watch.add(this)
  }
  notify() {
    //通知订阅者有变化
    this.subs.forEach((e, i) => {
      if (typeof e.update === 'function') {
        try {
          e.update.apply(e) //触发订阅者更新函数
        } catch (err) {
          console.log(err)
        }
      }
    })
  }
}

class Watch {
  id
  name
  callBack
  constructor(name, fn) {
    this.name = name //订阅消息的名称
    this.id = new Date() //这里简单的运用时间戳做订阅者的ID
    this.callBack = fn //订阅消息发送改变时->订阅者执行的回调函数
  }
  add(dep) {
    //将订阅者放入dep订阅池
    dep.subs.push(this)
  }
  update() {
    //将订阅者更新方法
    var cb = this.callBack //赋值为了不改变函数内调用的this
    cb(this.name)
  }
}
@Component({
  selector: 'app-flow-create',
  templateUrl: './flow-create.component.html',
  styleUrls: ['./flow-create.component.less'],
})
export class FlowCreateComponent extends ResultHelper implements OnInit {
  searchForm: FormGroup
  frameUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(null)
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, message: NzMessageService, private main: MainService) {
    super(message)
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [null],
    })
    this.loadData()
  }
  pageObj = {
    page: 1,
    size: 10,
    total: 0,
  }
  dataSet = []
  loading = false
  async loadData() {
    this.loading = true
    let [err, data] = await this.requestHelper(this.main.getModelList(this.pageObj), false)
    if (!err) {
      this.dataSet = data.content || []
      this.pageObj.total = data.totalElements
    }
    this.loading = false
  }
  addModel() {
    // this.frameUrl = 'http://221.10.144.35:8082/activity/create'
    // this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.baidu.com')
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://221.10.144.35:8082/activity/create')
    let iframe = document.getElementsByTagName('iframe')[0]
    console.log(iframe)
    var addHistoryMethod = (function () {
      var historyDep = new Dep()
      return name => {
        if (name === 'historychange') {
          return function (name, fn) {
            var event = new Watch(name, fn)
            Dep.watch = event
            historyDep.defined()
            Dep.watch = null //置空供下一个订阅者使用
          }
        } else if (name === 'pushState' || name === 'replaceState') {
          var method = history[name]
          return function () {
            method.apply(history, arguments)
            historyDep.notify()
          }
        }
        return null
      }
    })()

    // window.addHistoryListener =
    console.log(iframe.contentWindow)
    iframe.contentWindow.addEventListener = addHistoryMethod('historychange')
    let hist = iframe.contentWindow.history
    hist.pushState = addHistoryMethod('pushState')
    hist.replaceState = addHistoryMethod('replaceState')
    iframe.contentWindow['addHistoryListener']('history', function () {
      console.log('窗口的history改变了')
    })
    iframe.contentWindow['addHistoryListener']('history', function () {
      console.log('窗口的history改变了-我也听到了')
    })
  }

  async deploy(data) {
    let [err] = await this.requestHelper(this.main.deployModel(data.id))
    if (!err) this.loadData()
  }
  async delete(data) {
    let [err] = await this.requestHelper(this.main.deleteModel(data.id))
    if (!err) this.loadData()
  }
  closeIframe() {
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(null)
  }
  isNull(url) {
    // console.log(url)
    return url.changingThisBreaksApplicationSecurity === null
  }

  deployList = []
  async loadDataDeploy() {
    let [err, data] = await this.requestHelper(this.main.getdeployList())
    if (!err) {
      this.deployList = data
    }
  }

  selectIndex = 0
  selectChange(e) {
    if (e === 1) {
      this.loadDataDeploy()
    }
    console.log(e)
  }
}
