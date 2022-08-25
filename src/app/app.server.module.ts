import { NgModule } from '@angular/core';
// import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

// 引入必要的模块
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { en_US, NZ_I18N, NzI18nModule } from 'ng-zorro-antd/i18n';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // ModuleMapLoaderModule, // 用于实现服务端的路由的惰性加载
    ServerTransferStateModule, // 在服务端导入，用于实现将状态从服务器传输到客户端
    // HttpClientModule,
    // NoopAnimationsModule,
    // NzI18nModule,
  ],
  // providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
