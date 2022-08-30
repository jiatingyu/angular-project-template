import { FormControl } from '@angular/forms'
import { validateIdCard, validatePhone } from './commonUtil'

export const phoneValidator = (control: FormControl): { [s: string]: boolean | string } => {
  if (!control.value) {
    return { require: true }
  } else if (!validatePhone(control.value)) {
    return { message: '手机号码格式有误', error: true }
  }
  return {}
}
export const idCardValidator = (control: FormControl): { [s: string]: boolean | string } => {
  if (!control.value) {
    return { require: true }
  } else if (!validateIdCard(control.value)) {
    return { message: '身份证无效', error: true }
  }
  return {}
}
