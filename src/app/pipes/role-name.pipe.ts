import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'roleName',
})
export class RoleNamePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    console.log(value)
    console.log(args)
    return null
  }
}
