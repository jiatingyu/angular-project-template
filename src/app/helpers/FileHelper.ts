import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class FileHelper {
  downLoad(data) {
    let file = data.headers['content-disposition'].match(/fileName=(.*)/)
    let fileName = (file && file[1]) || '未命名文件'
    // const blob = new Blob([data.data], { type: 'application/octet-stream' })
    const blob = new Blob([data.data], { type: 'application/ynd.ms-excel;charset=UTF-8' })
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(fileName))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}
