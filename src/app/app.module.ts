import { BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState } from '@angular/platform-browser'
import { APP_ID, Inject, NgModule, PLATFORM_ID } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
// import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd'
import { DefaultComponent } from './layout/default/default.component'
import { PassportComponent } from './layout/passport/passport.component'
import { SectorComponent } from './pages/sector/sector.component'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { isPlatformBrowser, registerLocaleData } from '@angular/common'
import zh from '@angular/common/locales/zh'
import { LoginComponent } from './pages/passport/login/login.component'
import { MainMangeComponent } from './pages/main-manage/main-mange.component'
import { WaitOriginComponent } from './pages/wait-origin/wait-origin.component'
import { AnalysisComponent } from './pages/analysis/analysis.component'
import { MessageTemplateComponent } from './pages/message-template/message-template.component'
import { ShareModule } from './share/share.module'
import { TestComponent } from './pages/test/test.component'
import { SectorDetailComponent } from './pages/sector/sector-detail/sector-detail.component'
import { Store, StoreModule } from '@ngrx/store'
import { reducers, metaReducers, AppState } from './store'

import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { EffectsModule } from '@ngrx/effects'
import { CounterEffects } from './store/effects/counter.effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { MainDetailComponent } from './pages/main-manage/main-detail/main-detail.component'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { ClientInit } from './helpers/Clientinit'
import { STORE } from './utils/StateKey'
import { Init } from './store/actions/counter.actions'
import { RegisterComponent } from './pages/passport/register/register.component';
import { CardUploadComponent } from './components/card-upload/card-upload.component';
import { RegisterSuccessComponent } from './pages/passport/register/register-success/register-success.component';
import { HazardAreaComponent } from './pages/main-manage/hazard-area/hazard-area.component';
import { AnalysisOrgComponent } from './pages/analysis/analysis-org/analysis-org.component';
import { FlowCreateComponent } from './pages/flow/flow-create/flow-create.component';
import { FlowOperationComponent } from './pages/flow/flow-operation/flow-operation.component'
registerLocaleData(zh)

@NgModule({
  declarations: [
    AppComponent,
    PassportComponent,
    DefaultComponent,
    SectorComponent,
    LoginComponent,
    MainMangeComponent,
    WaitOriginComponent,
    AnalysisComponent,
    MessageTemplateComponent,
    TestComponent,
    SectorDetailComponent,
    MainDetailComponent,
    RegisterComponent,
    CardUploadComponent,
    RegisterSuccessComponent,
    HazardAreaComponent,
    AnalysisOrgComponent,
    FlowCreateComponent,
    FlowOperationComponent,
  ],
  imports: [
    // BrowserModule,
    TransferHttpCacheModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule, // ????????????????????????????????????????????????????????????????????????
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ShareModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([CounterEffects]),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [{ provide: 'init', useClass: ClientInit }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private state: TransferState,
    private store: Store
  ) {
    // ?????????????????????????????????????????????
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server'
    console.log(`Running ${platform} with appId=${appId}`)
    if (isPlatformBrowser(platformId)) {
      const state = this.state.get<AppState>(STORE, null)
      this.state.remove(STORE)
      console.log('state:', state)
      if (state) {
        this.store.dispatch(Init(state.counter))
      }
    } else {
      this.state.onSerialize(STORE, () => {
        let state
        this.store
          .subscribe((saveState: any) => {
            console.log('Set for browser', JSON.stringify(saveState))
            state = saveState
          })
          .unsubscribe()
        return state
      })
    }
  }
}
