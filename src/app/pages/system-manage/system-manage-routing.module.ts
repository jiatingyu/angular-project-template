import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DepartmentComponent } from './department/department.component'
import { PersonComponent } from './person/person.component'
import { ResourceComponent } from './resource/resource.component'
import { RoleComponent } from './role/role.component'
import { UserComponent } from './user/user.component'

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'resource',
    component: ResourceComponent,
  },
  {
    path: 'person',
    component: PersonComponent,
  },
  {
    path: 'department',
    component: DepartmentComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManageRoutingModule {}
