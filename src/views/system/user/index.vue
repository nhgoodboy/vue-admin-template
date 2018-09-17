<template>
  <div class="app-container">
    <el-table
      ref="singleTable"
      :data="list"
      highlight-current-row
      stripe
      style="width: 100%"
      @current-change="handleCurrentChange">
      <el-table-column
        prop="account"
        label="账号"/>
      <el-table-column
        prop="name"
        label="姓名"/>
      <el-table-column
        prop="sex"
        label="性别"/>
      <el-table-column
        prop="role"
        label="角色"/>
      <el-table-column
        prop="dept"
        label="部门"/>
      <el-table-column
        prop="emial"
        label="邮箱"/>
      <el-table-column
        prop="phone"
        label="电话"/>
      <el-table-column
        prop="createtime"
        label="创建时间"/>
      <el-table-column
        prop="status"
        label="状态"/>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/user'

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0
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
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
