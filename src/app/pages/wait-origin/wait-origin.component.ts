import { HttpClient } from '@angular/common/http'
import { Component, Inject, OnInit, Optional } from '@angular/core'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzUploadFile } from 'ng-zorro-antd/upload'
// import { NzMessageService, UploadChangeParam, UploadFile, UploadXHRArgs } from 'ng-zorro-antd'
import { FileHelper } from 'src/app/helpers/FileHelper'
import { getCurrentUser } from 'src/app/helpers/local-storage.service'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { UserType } from 'src/app/models/systems'
import { CommonService } from 'src/app/services/common.service'

import { REQUEST } from '@nguniversal/express-engine/tokens'
import { STORE } from 'src/app/utils/StateKey'
const KFCLIST_KEY = makeStateKey('kfcList')
@Component({
  selector: 'app-wait-origin',
  templateUrl: './wait-origin.component.html',
  styleUrls: ['./wait-origin.component.less'],
})
export class WaitOriginComponent extends ResultHelper implements OnInit {
  constructor(
    message: NzMessageService,
    private commonService: CommonService,
    private fileHelper: FileHelper,
    public http: HttpClient,
    private state: TransferState // @Inject('TOKEN') public token: any // @Inject(REQUEST) private request: Request
  ) {
    super(message)
    console.log(this)
  }
  dataSet = []
  loading = false
  downloading = false
  pageObj = {
    page: 1,
    size: 10,
    total: 0,
  }
  todosData = []
  ngOnInit() {
    this.loadData()
    const kfcList: any[] = this.state.get(KFCLIST_KEY, null as any)
    if (!kfcList) {
      // 请求设置
      this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe((v: any) => {
        console.log('发送请求成功。。。')
        this.todosData = v
        this.state.set(KFCLIST_KEY, v as any) // 存储数据
      })
    } else {
      this.todosData = kfcList
    }
  }
  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    console.log(file, fileList)
    // 系统用户不能上传
    if (getCurrentUser().userType === UserType.系统用户) {
      this.message.warning('系统用户无权上传')
      return false
    }
    if (fileList.every(file => /\.xls(x)?$/.test(file.name))) {
      return true
    }
    this.message.warning('暂只支持Excel文件解析！！')
    return false
  }

  async loadData() {
    try {
      this.loading = true
      let { page, size } = this.pageObj
      let obj = { page, size }
      let { meta, data } = await this.commonService.getUploadHistory(obj)
      if (!meta.success) {
        this.message.warning(meta.message)
        return
      }
      this.dataSet = data.content
      this.pageObj.total = data.totalElements
    } catch (error) {
      this.message.warning(error.message)
    } finally {
      this.loading = false
    }
  }

  customerRequest: any = async fileArgs => {
    console.log(fileArgs)
    let formData = new FormData()
    formData.append('files', fileArgs.file as any)
    const progressFn = event => {
      let progress = event.loaded / event.total
      console.log('上传进度：' + progress * 100 + '%')
      fileArgs.onProgress(event, fileArgs.file)
    }
    let [message] = await this.requestHelper(this.commonService.uploadFile(formData, progressFn))

    if (!message) {
      this.loadData()
      fileArgs.onSuccess(null, fileArgs.file, null)
    } else {
      fileArgs.onError(null, fileArgs.file)
    }
  }
  handleChange({ file, fileList }): void {
    const status = file.status
    if (status !== 'uploading') {
      console.log(file, fileList)
    }
    if (status === 'done') {
      this.message.success(`${file.name} 文件成功上传.`)
    } else if (status === 'error') {
      this.message.error(`${file.name} 文件上传失败.`)
    }
  }
  async delete(id: number) {
    let [message] = await this.requestHelper(this.commonService.deleteUpload(id))
    if (!message) {
      this.loadData()
    }
  }
  async downloadFile() {
    this.downloading = true
    let data = await this.commonService.downloadFile()
    try {
      this.fileHelper.downLoad(data)
    } catch (error) {
      console.log('下载出错', error.message)
    } finally {
      this.downloading = false
    }
  }
}
