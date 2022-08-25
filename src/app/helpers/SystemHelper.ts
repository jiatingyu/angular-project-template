import { Injectable } from '@angular/core'
import { IResource } from '../models/systems'
export interface TreeNodeInterface {
  id: number
  name: string
  age?: number
  level?: number
  expand?: boolean
  address?: string
  description?: string
  updateTime?: string
  icon?: string
  url?: string
  children?: TreeNodeInterface[]
  parent?: TreeNodeInterface
}
@Injectable({
  providedIn: 'root',
})
export class SystemHelper {
  // 资源层级显示
  cascadeResource(data: IResource[]) {
    let map = new Map()
    data.forEach(item => {
      item['key'] = item.id
      item['title'] = item.name
      if (item.parentId == null && !map.has(item.id)) {
        map.set(item.id, item)
      }
      if (item.parentId && map.get(item.parentId)) {
        let children = map.get(item.parentId).children
        children ? children.push(item) : (children = [item])
        map.get(item.parentId).children = children
      }
    })
    return [...map.values()]
  }

  /** 转换属性结构 */
  convertTreeToList(root): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = []
    const array: TreeNodeInterface[] = []
    const hashMap = {}
    stack.push({ ...root, level: 0, expand: false })

    while (stack.length !== 0) {
      const node = stack.pop()!
      this.visitNode(node, hashMap, array)
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node })
        }
      }
    }

    return array
  }

  visitNode(node: TreeNodeInterface, hashMap: { [id: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true
      array.push(node)
    }
  }
}
