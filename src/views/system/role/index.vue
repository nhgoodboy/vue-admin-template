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
        :label="$t('table.name1')"
        prop="name"/>
      <el-table-column
        :label="$t('table.parent_role')"
        prop="parent_role"/>
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
  </div>
</template>

<script>
import { fetchList, deleteRole, createRole, modifyRole } from '@/api/role'
// import { getRoleNameList } from '@/api/role'
// import { getDeptNameList } from '@/api/dept'

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
    create() {
      createRole
    },
    modifyCurrentRow() {
      modifyRole
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
    }
  }
}
</script>
