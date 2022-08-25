import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { APP_ID, Inject, NgModule, PLATFORM_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd'
import { DefaultComponent } from './layout/default/default.component';
import { PassportComponent } from './layout/passport/passport.component';
import { SectorComponent } from './pages/sector/sector.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LoginComponent } from './pages/passport/login/login.component';
import { MainMangeComponent } from './pages/main-mange/main-mange.component';
import { WaitOriginComponent } from './pages/wait-origin/wait-origin.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { MessageTemplateComponent } from './pages/message-template/message-template.component';
import { ShareModule } from './share/share.module';
import { TestComponent } from './pages/test/test.component';
import { SectorDetailComponent } from './pages/sector/sector-detail/sector-detail.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { CounterEffects } from './store/effects/counter.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
registerLocaleData(zh);
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
  ],
  imports: [
    // BrowserModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    // TransferHttpCacheModule,
    BrowserTransferStateModule, // 在客户端导入，用于实现将状态从服务器传输到客户端
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ShareModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([CounterEffects]),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {
    // 判断运行环境为客户端还是服务端
    const platform = isPlatformBrowser(platformId)
      ? 'in the browser'
      : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
