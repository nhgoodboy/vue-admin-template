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
      <el-form ref="form" :model="form" :inline="true" :rules="createOrModifyRules">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.account')" prop="account">
          <el-input v-model="form.account"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name')" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.phone')" prop="phone">
          <el-input v-model="form.phone"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.email')" prop="email">
          <el-input v-model="form.email"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.password')" prop="password">
          <el-input v-model="form.password" type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.confirm_pwd')" prop="confirm_pwd">
          <el-input v-model="form.confirm_pwd" type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.status')" prop="status">
          <el-select v-model="form.status">
            <el-option :label="$t('table.using')" value="启用"/>
            <el-option :label="$t('table.freeze')" value="冻结"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sex')" label-width="105px" prop="sex">
          <el-select v-model="form.sex">
            <el-option :label="$t('table.male')" value="男"/>
            <el-option :label="$t('table.female')" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.dept')" prop="dept">
          <el-select v-model="form.dept">
            <el-option v-for="item in deptNameList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.role')" label-width="105px" prop="role">
          <el-select v-model="form.role">
            <el-option v-for="item in roleNameList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteUser, createUser } from '@/api/user'
import { getRoleNameList } from '@/api/role'
import { getDeptNameList } from '@/api/dept'

export default {
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
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
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
        phone: 0,
        status: '',
        password: '',
        confirm_pwd: '',
        birthday: ''
      },
      formTitle: '',
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
        this.$alert('确定删除该条数据吗', '警告', {
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
      getRoleNameList().then(response => {
        this.roleNameList = response.data
      })
      getDeptNameList().then(response => {
        this.deptNameList = response.data
      })
      this.dialogFormVisible = true
      this.$refs['form'].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createUser(this.form).then(response => {
            this.getList()
            this.dialogFormVisible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
