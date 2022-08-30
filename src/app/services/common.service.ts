import { Injectable } from '@angular/core'
import { AxiosInstance } from 'axios'
import { Request } from '../helpers/Request'
import { IResponsePage } from '../models/systems'

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  request: AxiosInstance
  constructor(private http: Request) {
    this.request = this.http.request
  }

  getSectionList(params) {
    return this.request.get('/api', {
      params,
    })
  }
  uploadFile(data, progressFn?) {
    return this.request.post('/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: event => {
        progressFn && progressFn(event)
      },
    })
  }
  uploadImage(data) {
    return this.request.post('/upload/image', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  // 下载文件
  downloadFile() {
    return this.request.get('/upload', {
      responseType: 'blob',
    })
  }
  getUploadHistory(params): Promise<IResponsePage<any>> {
    return this.request.get('/log/upload', { params })
  }
  deleteUpload(id) {
    return this.request.delete(`/log/${id}`)
  }
}
