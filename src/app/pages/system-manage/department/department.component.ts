import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ResultHelper } from 'src/app/helpers/ResultHelper'
import { SystemHelper, TreeNodeInterface } from 'src/app/helpers/SystemHelper'
import { IResource } from 'src/app/models/systems'
import { SystemService } from 'src/app/services/system.service'

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less'],
})
export class DepartmentComponent extends ResultHelper implements OnInit {
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
      description: [],
    })
    this.loadData()
  }
  async loadData() {
    this.resourceLoading = true
    try {
      let { data } = await this.system.getDetapartments()
      this.listOfMapData = this.systemHelper.cascadeResource(data.content || [])
      // 数据变成级联结构

      this.parentResources = this.listOfMapData.map(item => ({ id: item.id, name: item.name }))
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.id] = this.systemHelper.convertTreeToList(item)
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
    this.validateForm.get('name').setValue(item.name || null)
    this.validateForm.get('description').setValue(item.description || null)
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
      let data = await this.system.operationDepartment(obj)
      console.log(data)
      this.loadData()
    }
  }
  async delete(id) {
    let [error] = await this.requestHelper(this.system.deleteDepartment(id))
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
}
