import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker'
import { NzUploadModule } from 'ng-zorro-antd/upload'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTreeModule } from 'ng-zorro-antd/tree'
import { NzMessageModule } from 'ng-zorro-antd/message'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzTagModule } from 'ng-zorro-antd/tag'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions'
// import { NzButtonModule } from 'ng-zorro-antd/button'
import { UserTypePipe } from '../pipes/user-type.pipe'
import { RoleNamePipe } from '../pipes/role-name.pipe'

const commonNgZorror = [
  NzButtonModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzLayoutModule,
  NzSpaceModule,
  NzDropDownModule,
  NzMenuModule,
  NzPageHeaderModule,
  NzPaginationModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzInputModule,
  NzSelectModule,
  NzTimePickerModule,
  NzUploadModule,
  NzCardModule,
  NzTableModule,
  NzTreeModule,
  NzMessageModule,
  NzModalModule,
  NzPopconfirmModule,
  NzSpinModule,
  NzDividerModule,
  NzTagModule,
  NzPopoverModule,
  NzAvatarModule,
  NzDescriptionsModule,
]

@NgModule({
  declarations: [RoleNamePipe, UserTypePipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...commonNgZorror],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RoleNamePipe, UserTypePipe, ...commonNgZorror],
})
export class ShareModule {}
