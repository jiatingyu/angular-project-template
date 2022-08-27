import { Inject, NgModule } from '@angular/core'
// import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'

import { AppModule } from './app.module'
import { AppComponent } from './app.component'

// 引入必要的模块
import { HttpClientModule } from '@angular/common/http'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { TransferState } from '@angular/platform-browser'
import { Store } from '@ngrx/store'
import { increment_num } from './store/actions/counter.actions'
import { Token } from './helpers/Token'
import { timer } from 'rxjs'

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // ModuleMapLoaderModule, // 用于实现服务端的路由的惰性加载
    ServerTransferStateModule, // 在服务端导入，用于实现将状态从服务器传输到客户端
    HttpClientModule,
  ],
  // providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(
    private token: Token,
    private state: TransferState,
    private store: Store,
    @Inject(REQUEST) private request: Request
  ) {
    this.token.name = '李四'
    console.log('获取请求信息：', this.request.url)
    timer(5000).subscribe(v => {
      this.store.dispatch(increment_num({ num: 8 }))
      console.log('延迟5s完成')
    })
  }
}
