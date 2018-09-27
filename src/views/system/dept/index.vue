<template>
  <div class="app-container">
    <el-button type="primary" @click="handleCreate">{{ $t('button.create') }}</el-button>
    <el-button type="success" @click="modifyCurrentRow">{{ $t('button.modify') }}</el-button>
    <el-button type="danger" @click="deleteCurrentRow">{{ $t('button.delete') }}</el-button>

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
        prop="fullname"/>
      <el-table-column
        :label="$t('table.parent_dept')"
        prop="parent_dept"/>
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
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name1')" prop="fullname">
          <el-input v-model="form.fullname" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.parent_dept')" prop="parent_dept">
          <el-select v-model="form.parent_dept">
            <el-option v-for="item in deptNameList" :key="item" :label="item" :value="item" :disabled="handleDisable(item)"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm('form')">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteDept, createDept, modifyDept } from '@/api/dept'
import { getDeptNameList } from '@/api/dept'

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
      deptNameList: [],
      form: {
        id: undefined,
        fullname: '',
        parent_dept: ''
      },
      createOrModifyRules: {
        fullname: [{ required: true, trigger: 'blur', message: '请输入部门名称' }],
        parent_dept: [{ required: true, trigger: 'change', message: '请选择父部门' }]
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
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
    getDeptNameList() {
      getDeptNameList().then(response => {
        this.deptNameList = response.data
      })
    },
    handleCreate() {
      this.form = {
        fullname: '',
        parent_dept: ''
      }
      this.formTitle = this.$t('button.create')
      this.isCreate = true
      this.getDeptNameList()
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
        this.getDeptNameList()
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
          message: '不允许删除超级部门'
        })
      } else {
        this.$confirm('确定删除该条数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDept(this.currentRow.id).then(response => {
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
            createDept(this.form).then(response => {
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
            modifyDept(this.form).then(response => {
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
        return item === this.currentRow.fullname
      }
      return false
    }
  }
}
</script>
