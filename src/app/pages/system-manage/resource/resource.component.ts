import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { SystemHelper, TreeNodeInterface } from 'src/app/helpers/SystemHelper'
import { IResource } from 'src/app/models/systems'
import { SystemService } from 'src/app/services/system.service'
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.less'],
})
export class ResourceComponent extends ResultHelper implements OnInit {
  resourceLoading: boolean = false
  validateForm: FormGroup
  resourceVisible: boolean = false
  // 父级资源
  parentResources = []
  constructor(
    private fb: FormBuilder,
    private system: SystemService,
    message: NzMessageService,
    private systemHelper: SystemHelper
  ) {
    super(message)
  }
  submitForm() {}
  ngOnInit() {
    this.validateForm = this.fb.group({
      parentId: [],
      name: [null, Validators.required],
      icon: [],
      url: [],
    })
    this.loadData()
  }
  async loadData() {
    this.resourceLoading = true
    try {
      let { data } = await this.system.getResources()
      this.listOfMapData = this.systemHelper.cascadeResource(data.content || [])
      // 数据变成级联结构

      this.parentResources = this.listOfMapData.map(item => ({ id: item.id, name: item.name }))
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item)
      })
    } catch (error) {
      console.dir(error)
    } finally {
      this.resourceLoading = false
    }
  }

  selectedRow = { id: 0, name: '' }
  selectRow(row) {
    // 只有第一层才能选择
    if (row.level === 0) {
      if (this.selectedRow.id === row.id) {
        this.selectedRow = { id: 0, name: '' }
      } else {
        this.selectedRow = row
      }
    }
  }
  editObj = null
  edit(item, e: Event) {
    this.editObj = item
    e.preventDefault()
    this.validateForm.get('parentId').setValue(item.parentId || null)
    this.validateForm.get('icon').setValue(item.icon || null)
    this.validateForm.get('name').setValue(item.name || null)
    this.validateForm.get('url').setValue(item.url || null)
    this.resourceVisible = true
  }
  add() {
    this.editObj = null
    this.validateForm.get('parentId').setValue(this.selectedRow.id || null)
    this.resourceVisible = true
  }
  async addHandle() {
    this.resourceVisible = false
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
    if (this.validateForm.valid) {
      let obj = { ...this.validateForm.value }
      if (this.editObj) {
        obj['id'] = this.editObj.id
      }
      let data = await this.system.operationResouce(obj)
      console.log(data)
      this.loadData()
    }
  }
  async delete(id) {
    let [error] = await this.requestHelper(this.system.deleteResource(id))
    if (!error) {
      this.loadData()
    }
  }

  listOfMapData: IResource[] = [
    {
      name: 'John Brown sr.',
    },
    {
      name: 'Joe Black',
    },
  ]
  mapOfExpandedData: { [id: string]: TreeNodeInterface[] } = {}

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!
          target.expand = false
          this.collapse(array, target, false)
        })
      } else {
        return
      }
    }
  }

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
  /** 原本的对象+目标的orderNum 来实现换位 */
  async upAndDown(data, goal) {
    console.log(data, goal)
    let obj = { ...data, orderNum: goal.orderNum }
    let [err] = await this.requestHelper(this.system.operationResouce(obj))
    !err && this.loadData()
  }
}
