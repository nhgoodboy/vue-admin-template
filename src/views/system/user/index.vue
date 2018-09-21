<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogFormVisible = true">{{ $t('button.create') }}</el-button>
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

    <el-dialog :visible.sync="dialogFormVisible" title="收货地址">
      <!--<el-form :model="form">-->
      <!--<el-form-item :label-width="formLabelWidth" label="活动名称">-->
      <!--<el-input v-model="form.name" auto-complete="off"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label-width="formLabelWidth" label="活动区域">-->
      <!--<el-select v-model="form.region" placeholder="请选择活动区域">-->
      <!--<el-option label="区域一" value="shanghai"/>-->
      <!--<el-option label="区域二" value="beijing"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteUser } from '@/api/user'

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
      dialogFormVisible: false
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
    }
  }
}
</script>
