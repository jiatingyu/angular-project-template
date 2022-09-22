import { NzMessageService } from 'ng-zorro-antd/message'

export class ResultHelper {
  message: NzMessageService = null
  constructor(message) {
    this.message = message
  }
  async requestHelper(fn, successNotfiy = true): Promise<[string | null, any?]> {
    try {
      let { meta, data } = await fn
      if (meta.success) {
        successNotfiy && this.message.success('操作成功')
        return [null, data]
      } else {
        this.message.warning(meta.message)
        return [meta.message]
      }
    } catch (error) {
      this.message.error(error.message)
      return [error.message]
    }
  }
}
