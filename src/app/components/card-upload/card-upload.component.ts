import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { extend } from 'lodash'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { CommonService } from 'src/app/services/common.service'

@Component({
  selector: 'app-card-upload',
  templateUrl: './card-upload.component.html',
  styleUrls: ['./card-upload.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardUploadComponent),
      multi: true,
    },
  ],
})
export class CardUploadComponent extends ResultHelper implements OnInit, ControlValueAccessor {
  @Input('length') length = 0
  // @Input('formControl') name: any
  // @Input('xck') xck: any
  // @Output('xckChange') updateXck: EventEmitter<any> = new EventEmitter()
  constructor(message: NzMessageService, private commonService: CommonService) {
    super(message)
  }
  input = ''
  onChange: any = () => {}
  onTouch: any = () => {}
  writeValue(obj: any): void {
    // throw new Error('Method not implemented.')
    this.input = obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.')
  }

  ngOnInit(): void {}

  // 文件上传

  previewVisible = false
  previewImage = ''
  fileList = []
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    // if (!file.url) {
    //   file.preview = await getBase64(file.originFileObj!);
    // }
    this.previewImage = file.thumbUrl || file.url
    this.previewVisible = true
  }
  customRequest: any = async fileArgs => {
    console.log(fileArgs)
    let formData = new FormData()
    formData.append('img', fileArgs.file as any)
    // const progressFn = event => {
    //   let progress = event.loaded / event.total
    //   console.log('上传进度：' + progress * 100 + '%')
    //   fileArgs.onProgress(event, fileArgs.file)
    // }
    let [message, data] = await this.requestHelper(this.commonService.uploadImage(formData))
    if (!message) {
      //
      this.input = data || 'my url'
      this.onChange(this.input)
      fileArgs.onSuccess(null, fileArgs.file, null)
    } else {
      fileArgs.onError(null, fileArgs.file)
    }
  }
}
