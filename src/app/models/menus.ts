export interface IMenus {
  name: string
  url?: string
  icon?: string
  children?: IMenus[]
}
export const menus: IMenus[] = [
  {
    name: '行业常态化检测',
    url: '/sector',
    icon: 'dot-chart',
  },
  {
    name: '管控重点检测',
    url: '/mainManage',
    icon: 'appstore',
  },
  {
    name: '待检数据源配置',
    url: '/waitOrigin',
    icon: 'database',
  },
  {
    name: '系统设置',
    url: '',
    icon: 'setting',
    children: [
      { name: '用户管理', url: '/system/user', icon: '' },
      { name: '角色管理', url: '/system/role', icon: '' },
      { name: '资源管理', url: '/system/resource', icon: '' },
    ],
  },
  {
    name: '统计分析报表',
    url: '/analysis',
    icon: 'sliders',
  },
  {
    name: '短信模板',
    url: '/messageTemplate',
    icon: 'pie-chart',
  },
]
