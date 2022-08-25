import { isPlatformBrowser } from '@angular/common';
import { APP_ID, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { getCurrentUser } from '../helpers/local-storage.service';
import { IUser } from '../models/systems';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    try {
      const platform = isPlatformBrowser(this.platformId);
      console.log('platform:', platform);
      if (!platform) {
        return true;
      }
      let user: IUser = getCurrentUser();
      let role = user.roleVo;
      let resource = role.resourceVos;
      if (!resource.length) {
        throw new Error('无权限');
      }
      let res = resource.filter((item) => item.url === state.url);
      if (res.length) {
        // 存在
        return true;
      } else {
        // 不存在
        return this.router.createUrlTree([resource[0].url]);
      }
    } catch (error) {
      // 默认去登录页面
      console.log('服务出错了：', error.message);
      return this.router.createUrlTree(['/passport']);
    }
  }
}
