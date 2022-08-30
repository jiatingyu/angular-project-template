import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './guards/auth.guard'
import { DefaultComponent } from './layout/default/default.component'
import { PassportComponent } from './layout/passport/passport.component'
import { AnalysisComponent } from './pages/analysis/analysis.component'
import { HazardAreaComponent } from './pages/main-manage/hazard-area/hazard-area.component'
import { MainDetailComponent } from './pages/main-manage/main-detail/main-detail.component'
import { MainMangeComponent } from './pages/main-manage/main-mange.component'
import { MessageTemplateComponent } from './pages/message-template/message-template.component'
import { LoginComponent } from './pages/passport/login/login.component'
import { RegisterSuccessComponent } from './pages/passport/register/register-success/register-success.component'
import { RegisterComponent } from './pages/passport/register/register.component'
import { SectorDetailComponent } from './pages/sector/sector-detail/sector-detail.component'
import { SectorComponent } from './pages/sector/sector.component'
import { TestComponent } from './pages/test/test.component'
import { WaitOriginComponent } from './pages/wait-origin/wait-origin.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'waitOrigin',
  },
  {
    path: 'passport',
    component: PassportComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'sector',
        component: SectorComponent,
      },
      {
        path: 'sector/detail',
        component: SectorDetailComponent,
      },
      {
        path: 'mainManage',
        component: MainMangeComponent,
      },
      {
        path: 'mainManage/hazard',
        component: HazardAreaComponent,
      },
      {
        path: 'mainManage/detail',
        component: MainDetailComponent,
      },
      {
        path: 'waitOrigin',
        component: WaitOriginComponent,
      },
      {
        path: 'system',
        // component: UserComponent,
        loadChildren: () => import('./pages/system-manage/system-manage.module').then(mod => mod.SystemManageModule),
      },

      {
        path: 'messageTemplate',
        component: MessageTemplateComponent,
      },
    ],
  },
  {
    path: 'analysis',
    component: AnalysisComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register/success',
    component: RegisterSuccessComponent,
  },
  {
    path: 'test',
    component: TestComponent,
    children: [
      { path: 'sector', component: SectorComponent, outlet: 'left' },
      { path: 'main', component: MainMangeComponent, outlet: 'right' },
      { path: 'wait', component: WaitOriginComponent, outlet: 'right' },
    ],
  },
]

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
