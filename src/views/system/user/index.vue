<template>
  <div class="app-container">
    <el-button type="primary" @click="create">{{ $t('button.create') }}</el-button>
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
        :label="$t('table.account')"
        prop="account"/>
      <el-table-column
        :label="$t('table.name')"
        prop="name"/>
      <el-table-column
        :label="$t('table.sex')"
        prop="sex"/>
      <el-table-column
        :label="$t('table.role')"
        prop="role"/>
      <el-table-column
        :label="$t('table.dept')"
        prop="dept"/>
      <el-table-column
        :label="$t('table.email')"
        prop="email"/>
      <el-table-column
        :label="$t('table.phone')"
        prop="phone"/>
      <el-table-column
        :label="$t('table.createtime')"
        prop="createtime"/>
      <el-table-column
        :label="$t('table.status')"
        prop="status"/>
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

    <el-dialog :visible.sync="dialogFormVisible" :title="formTitle">
      <el-form :model="form" :inline="true">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.account')">
          <el-input v-model="form.account"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name')">
          <el-input v-model="form.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.email')">
          <el-input v-model="form.email" type="email"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.phone')">
          <el-input v-model="form.phone" type="number" maxlength="11" minlength="11"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.password')">
          <el-input v-model="form.password" type="password" minlength="6"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.confirm_pwd')">
          <el-input v-model="form.confirm_password" type="password" minlength="6"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.status')">
          <el-select v-model="form.status">
            <el-option :label="$t('table.using')" value="1"/>
            <el-option :label="$t('table.freeze')" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sex')" label-width="120px">
          <el-select v-model="form.sex">
            <el-option :label="$t('table.male')" value="1"/>
            <el-option :label="$t('table.female')" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.dept')">
          <el-select v-model="form.dept">
            <el-option :label="$t('table.male')" value="male"/>
            <el-option :label="$t('table.female')" value="female"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.role')" label-width="120px">
          <el-select v-model="form.dept">
            <el-option :label="$t('table.male')" value="male"/>
            <el-option :label="$t('table.female')" value="female"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteUser, getRolesList, getDeptsList } from '@/api/user'

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
      dialogFormVisible: false,
      form: {
        account: '',
        name: '',
        sex: '',
        role: '',
        dept: '',
        email: '',
        phone: '',
        status: '',
        password: '',
        confirm_password: '',
        birthday: ''
      },
      formTitle: '',
      formLabelWidth: '140px',
      rolesList: [],
      deptsList: []
    }
  },

  computed: {

  },

  created() {
    this.getList()
  },

  mounted() {

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
    modifyCurrentRow() {
      if (!this.currentRow) {
        this.$message({
          message: '请先选择一行，再点击修改按钮',
          type: 'warning'
        })
      }
    },
    deleteCurrentRow() {
      if (!this.currentRow) {
        this.$message({
          message: '请先选择一行，再点击删除按钮',
          type: 'warning'
        })
      } else {
        this.$alert('确定删除该条数据吗，删除后不可恢复哦', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            deleteUser(this.currentRow.id).then(response => {
              this.$message({
                type: 'success',
                message: '已删除该条数据'
              })
              this.getList()
            })
          }
        })
      }
    },
    create() {
      this.form = {
        account: '',
        name: '',
        sex: '',
        role: '',
        dept: '',
        email: '',
        phone: '',
        status: '',
        password: '',
        confirm_password: '',
        birthday: ''
      }
      this.formTitle = this.$t('button.create')
      getRolesList().then(response => {
        this.rolesList = response.data
      })
      getDeptsList().then(response => {
        this.deptsList = response.data
      })
      this.dialogFormVisible = true
    }
  }
}
</script>
