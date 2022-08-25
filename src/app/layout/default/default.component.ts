import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  getCurrentUser,
  LocalStorageService,
} from 'src/app/helpers/local-storage.service';
import { SystemHelper } from 'src/app/helpers/SystemHelper';
import { IMenus, menus } from 'src/app/models/menus';
import { IResource, IRole, IUserInfo } from 'src/app/models/systems';
import { isServer } from 'src/app/utils/commonUtil';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
})
export class DefaultComponent implements OnInit {
  constructor(
    private router: Router,
    private systemHelper: SystemHelper,
    private message: NzMessageService
  ) {}
  menus: IMenus[] = menus;
  userInfo: IUserInfo;
  role: IRole;
  resouces: IResource[];
  ngOnInit() {
    if (isServer()) {
      return;
    }
    // 获取用户信息
    let user = getCurrentUser();
    try {
      if (user) {
        // 当前登录用户
        this.userInfo = user;
        // 当前角色
        this.role = this.userInfo.roleVo!;
        // 菜单资源
        this.resouces = this.role.resourceVos;
        // 结构化
        let data = this.systemHelper.cascadeResource(this.resouces);
        if (data && data.length) {
          this.menus = data;
        } else {
          this.message.warning('无权操作');
          this.loginOut();
        }
      } else {
        this.loginOut();
      }
    } catch (error) {
      this.loginOut();
    }
  }
  loginOut() {
    window.localStorage.clear();
    this.router.navigate(['passport']);
  }
  menuClick(event) {
    // console.log(event)
  }
  hasSelect(router) {
    return this.router.url === router;
  }
  toPerson() {
    this.router.navigate(['/system/person']);
  }
  byRoutertoName() {
    if (isServer) {
      return '';
    }
    let res = '';
    let router = location.pathname;
    let findBy = (menus, router) => {
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].children) {
          findBy(menus[i].children, router);
        }
        if (menus[i].router === router) {
          res = menus[i].name;
          return;
        }
      }
    };
    findBy(this.menus, router);
    return res;
  }
}
