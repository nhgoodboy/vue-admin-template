<template>
  <div class="app-container">
    <el-button type="primary" @click="handleCreate">{{ $t('button.create') }}</el-button>
    <el-button type="success" @click="modifyCurrentRow">{{ $t('button.modify') }}</el-button>
    <el-button type="danger" @click="deleteCurrentRow">{{ $t('button.delete') }}</el-button>
    <el-button type="warning" @click="changePassword">{{ $t('button.changePassword') }}</el-button>

    <el-input :placeholder="$t('table.account')" v-model="queryContent" style="width: 200px;" @keyup.enter.native="handleFilter"/>
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>

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

    <el-dialog :visible.sync="dialogFormVisible" :title="formTitle" width="40%">
      <el-form ref="form" :model="form" :inline="true" :rules="createOrModifyRules">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.account')" prop="account">
          <el-input v-model="form.account" :disabled="!isCreate" :style="inputStyle"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name')" prop="name">
          <el-input v-model="form.name" :style="inputStyle"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.phone')" prop="phone">
          <el-input v-model="form.phone" :style="inputStyle"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.email')" prop="email">
          <el-input v-model="form.email" :style="inputStyle"/>
        </el-form-item>
        <el-form-item v-if="isCreate" :label-width="formLabelWidth" :label="$t('table.password')" prop="password">
          <el-input v-model="form.password" :style="inputStyle" type="password"/>
        </el-form-item>
        <el-form-item v-if="isCreate" :label-width="formLabelWidth" :label="$t('table.confirm_pwd')" prop="confirm_pwd">
          <el-input v-model="form.confirm_pwd" :style="inputStyle" type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.status')" prop="status">
          <el-select v-model="form.status">
            <el-option label="启用" value="启用"/>
            <el-option label="冻结" value="冻结"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sex')" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="form.sex">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.dept')" prop="dept">
          <el-select v-model="form.dept">
            <el-option v-for="item in deptNameList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.role')" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role">
            <el-option v-for="item in roleNameList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isCreate" :label-width="formLabelWidth" :label="$t('table.createtime')">
          <el-input v-model="form.createtime" :disabled="true" :style="inputStyle"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm('form')">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPwdFormVisible" :title="$t('button.changePassword')" width="25%">
      <el-form ref="changePwdForm" :model="changePwdForm" :rules="changePwdRule">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.new_password')" prop="newPassword">
          <el-input v-model="changePwdForm.newPassword" :style="inputStyle" type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.confirm_pwd')" prop="confirmPwd">
          <el-input v-model="changePwdForm.confirmPwd" :style="inputStyle" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitChangePwdForm('changePwdForm')">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-tooltip :content="$t('tooltip.backToTop')" placement="top">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade"/>
    </el-tooltip>
  </div>
</template>

<script>
import { fetchList, deleteUser, createUser, modifyUser, changePwd } from '@/api/user'
import { getRoleNameList } from '@/api/role'
import { getDeptNameList } from '@/api/dept'
import waves from '@/directive/waves' // 水波纹指令
import BackToTop from '@/components/BackToTop'

export default {
  directives: {
    waves
  },
  components: { BackToTop },
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (value.trim() && !reg.test(value)) {
        callback(new Error('请输入正确的电话'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (value.trim() && !reg.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateConfirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.isCreate && value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else if (!this.isCreate && value !== this.changePwdForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      queryContent: '',
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
        id: undefined,
        account: '',
        name: '',
        sex: '',
        role: '',
        dept: '',
        email: '',
        phone: undefined,
        status: '',
        createtime: ''
      },
      formTitle: '',
      isCreate: true,
      formLabelWidth: '120px',
      roleNameList: [],
      deptNameList: [],
      createOrModifyRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        name: [{ required: true, trigger: 'blur', message: '请输入性名' }],
        phone: [{ required: false, trigger: 'blur', validator: validatePhone }],
        email: [{ required: false, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirm_pwd: [{ required: true, trigger: 'blur', validator: validateConfirmPwd }],
        status: [{ required: true, trigger: 'change', message: '请选择状态' }],
        sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
        dept: [{ required: true, trigger: 'change', message: '请选择部门' }],
        role: [{ required: true, trigger: 'change', message: '请选择角色' }]
      },
      changePwdForm: {
        id: undefined,
        newPassword: '',
        confirmPwd: ''
      },
      dialogPwdFormVisible: false,
      changePwdRule: {
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPwd: [{ required: true, trigger: 'blur', validator: validateConfirmPwd }]
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      inputStyle: {
        width: '200px'
      }
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
    getDeptAndRoleNameList() {
      if (!this.roleNameList.length) {
        getRoleNameList().then(response => {
          this.roleNameList = response.data
        })
      }
      if (!this.deptNameList.length) {
        getDeptNameList().then(response => {
          this.deptNameList = response.data
        })
      }
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
          message: '不允许删除超级管理员'
        })
      } else {
        this.$confirm('确定删除该条数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(this.currentRow.id).then(response => {
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
    handleCreate() {
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
        confirm_password: ''
      }
      this.formTitle = this.$t('button.create')
      this.isCreate = true
      this.getDeptAndRoleNameList()
      this.dialogFormVisible = true
      this.$nextTick(() => { // 清空验证
        this.$refs['form'].clearValidate()
      })
    },
    submitForm(formName) {
      if (this.isCreate) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createUser(this.form).then(response => {
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
            modifyUser(this.form).then(response => {
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
    changePassword() {
      if (!this.currentRow) {
        this.$message({
          message: '请先选择一行，再点击更改密码按钮',
          type: 'warning'
        })
      } else {
        this.changePwdForm = {
          id: this.currentRow.id,
          newPassword: '',
          confirmPwd: ''
        }
        this.dialogPwdFormVisible = true
        this.$refs['changePwdForm'].clearValidate()
      }
    },
    submitChangePwdForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePwd(this.changePwdForm).then(response => {
            this.dialogPwdFormVisible = false
            this.$message({
              type: 'success',
              message: '密码更改成功'
            })
          })
        } else {
          return false
        }
      })
    },
    handleFilter() {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
