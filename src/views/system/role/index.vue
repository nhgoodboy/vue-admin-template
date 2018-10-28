<template>
  <div class="app-container">
    <el-button v-if="checkPermission('role_add')" type="primary" @click="handleCreate">{{ $t('button.create') }}</el-button>
    <el-button v-if="checkPermission('role_edit')" type="success" @click="modifyCurrentRow">{{ $t('button.modify') }}</el-button>
    <el-button v-if="checkPermission('role_delete')" type="danger" @click="deleteCurrentRow">{{ $t('button.delete') }}</el-button>
    <el-button v-if="checkPermission('role_permission_config')" type="primary" @click="permissionConfig">{{ $t('button.permissionConfig') }}</el-button>

    <el-table
      v-loading.body="listLoading"
      ref="singleTable"
      :data="list"
      highlight-current-row
      stripe
      style="width: 100%"
      @current-change="handleCurrentRowChange">
      <el-table-column
        :label="$t('table.name1')"
        prop="name"/>
      <el-table-column
        :label="$t('table.dept')"
        prop="dept"/>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"/>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" :title="formTitle" width="30%">
      <el-form ref="form" :model="form" :rules="createOrModifyRules">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name1')" prop="name">
          <el-input v-model="form.name" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.dept')" prop="dept">
          <el-select v-model="form.dept">
            <el-option v-for="item in deptNameList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm('form')">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="permissionConfigDialog" :title="$t('button.permissionConfig')" width="30%">
      <el-tree
        ref="menuTree"
        :data="menusList"
        :default-checked-keys="checkedMenuIds"
        :props="menuProps"
        :default-expand-all="true"
        show-checkbox
        check-strictly
        node-key="id"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionConfigDialog = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitPermissionConfig">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteRole, createRole, modifyRole } from '@/api/role'
import { getRoleNameList, getMenusTree, changePermission } from '@/api/role'
import { getDeptNameList } from '@/api/dept'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      currentRow: null,
      formTitle: '',
      formLabelWidth: '120px',
      isCreate: true,
      dialogFormVisible: false,
      roleNameList: [],
      deptNameList: [],
      form: {
        id: undefined,
        name: '',
        dept: ''
      },
      createOrModifyRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
        parent_role: [{ required: true, trigger: 'change', message: '请选择父角色' }],
        dept: [{ required: true, trigger: 'change', message: '请选择部门' }]
      },
      permissionConfigDialog: false,
      checkedMenuIds: [],
      menusList: [],
      menuProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handlePageSizeChange(limit) {
      this.listQuery.limit = limit
      this.getList()
    },
    handleCurrentPageChange(page) {
      this.listQuery.page = page
      this.getList()
    },
    handleCurrentRowChange(row) {
      this.currentRow = row
    },
    getDeptAndRoleNameList() {
      getRoleNameList().then(response => {
        this.roleNameList = response.data
      }).catch(error => { console.log(error) })
      getDeptNameList().then(response => {
        this.deptNameList = response.data
      }).catch(error => { console.log(error) })
    },
    handleCreate() {
      this.form = {
        name: '',
        parent_role: '',
        dept: ''
      }
      this.formTitle = this.$t('button.create')
      this.isCreate = true
      this.getDeptAndRoleNameList()
      this.dialogFormVisible = true
      this.$nextTick(() => { // 清空验证
        this.$refs['form'].clearValidate()
      })
    },
    modifyCurrentRow() {
      if (!this.currentRow) {
        this.$message({
          message: '请先选择一行，再点击修改按钮',
          type: 'warning'
        })
      } else {
        this.formTitle = this.$t('button.modify')
        this.isCreate = false
        this.getDeptAndRoleNameList()
        this.dialogFormVisible = true
        this.$nextTick(() => { // 清空验证
          this.$refs['form'].clearValidate()
        })
        this.form = Object.assign({}, this.currentRow)
      }
    },
    deleteCurrentRow() {
      if (!this.currentRow) {
        this.$message({
          message: '请先选择一行，再点击删除按钮',
          type: 'warning'
        })
      } else if (this.currentRow.id === 1) {
        this.$message({
          type: 'warning',
          message: '不允许删除超级管理员角色'
        })
      } else {
        this.$confirm('确定删除该条数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(this.currentRow.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    submitForm(formName) {
      if (this.isCreate) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createRole(this.form).then(response => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '创建成功'
              })
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyRole(this.form).then(response => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            })
          } else {
            return false
          }
        })
      }
    },
    handleDisable(item) {
      if (this.currentRow) {
        return item === this.currentRow.name
      }
      return false
    },
    permissionConfig() {
      if (!this.currentRow) {
        this.$message({
          message: '请先选择角色，再进行权限配置',
          type: 'warning'
        })
      } else {
        this.permissionConfigDialog = true
        getMenusTree(this.currentRow.id).then(resp => {
          this.menusList = resp.data.menusList
          this.checkedMenuIds = resp.data.checkedMenuIds
        })
      }
    },
    submitPermissionConfig() {
      if (this.currentRow.id === 1) {
        this.$message({
          message: '不允许修改超级管理员的权限',
          type: 'warning'
        })
      } else {
        changePermission(this.currentRow.id, this.$refs.menuTree.getCheckedKeys()).then(resp => {
          this.permissionConfigDialog = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }
    }
  }
}
</script>
