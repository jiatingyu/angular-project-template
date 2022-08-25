import { Pipe, PipeTransform } from '@angular/core'
import { UserType } from '../models/systems'

@Pipe({
  name: 'userType',
})
export class UserTypePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return UserType[value]
  }
}
