<template>
  <div class="app-container">
    <el-table
      v-loading.body="listLoading"
      ref="singleTable"
      :data="list"
      highlight-current-row
      stripe
      style="width: 100%"
      @current-change="handleCurrentChange">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/user'

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
