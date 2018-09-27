<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="image-box" @click="changeAvatarr">
        <pan-thumb :image="avatar" width="120px" height="120px">
          {{ $t('profile.change_avatar') }}
        </pan-thumb>
      </div>
      <el-form ref="form" :model="form" :inline="true" :rules="editRules" class="form-box">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.account')" prop="account" class="form-item">
          <el-input v-if="isEdit" v-model="form.account" disabled="true" class="input-box"/>
          <div v-else class="input-box">{{ form.account }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name')" prop="name" class="form-item">
          <el-input v-if="isEdit" v-model="form.name" class="input-box"/>
          <div v-else class="input-box">{{ form.name }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.sex')" prop="sex" class="form-item">
          <el-input v-if="isEdit" v-model="form.sex" class="input-box"/>
          <div v-else class="input-box">{{ form.sex }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.role')" prop="role" class="form-item">
          <el-input v-if="isEdit" v-model="form.role" class="input-box" disabled="true"/>
          <div v-else class="input-box">{{ form.role }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.dept')" prop="dept" class="form-item">
          <el-input v-if="isEdit" v-model="form.dept" class="input-box" disabled="true"/>
          <div v-else class="input-box">{{ form.dept }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.email')" prop="email" class="form-item">
          <el-input v-if="isEdit" v-model="form.email" class="input-box"/>
          <div v-else class="input-box">{{ form.email }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.phone')" prop="phone" class="form-item">
          <el-input v-if="isEdit" v-model="form.phone" class="input-box"/>
          <div v-else class="input-box">{{ form.phone }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.birthday')" prop="birthday" class="form-item">
          <el-input v-if="isEdit" v-model="form.birthday" class="input-box"/>
          <div v-else class="input-box">{{ form.birthday }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.createtime')" prop="createtime" class="form-item">
          <el-input v-if="isEdit" v-model="form.createtime" class="input-box" disabled="true"/>
          <div v-else class="input-box">{{ form.createtime }}</div>
        </el-form-item>
      </el-form>
      <el-button v-if="!isEdit" class="button-box" type="primary" @click="handleEdit">{{ $t('table.edit') }}</el-button>
      <div v-else class="button-box-else">
        <el-button @click="handleCancel">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },

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
    return {
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      form: {
        id: 1,
        account: '12332',
        name: 'zxczxc',
        sex: '男',
        role: '超级管理员',
        dept: '总公司',
        email: '898989@ qq.com',
        phone: 18956859458,
        birthday: '2018-07-01 10:00:00',
        createtime: '2018-07-01 10:00:00'
      },
      isEdit: false,
      editRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入性名' }],
        phone: [{ required: false, trigger: 'blur', validator: validatePhone }],
        email: [{ required: false, trigger: 'blur', validator: validateEmail }],
        sex: [{ required: true, trigger: 'change', message: '请选择性别' }]
      },
      formLabelWidth: '100px'
    }
  },

  created() {
  },

  methods: {
    changeAvatarr() {
      this.$message('hello')
    },
    handleEdit() {
      this.isEdit = true
    },
    handleCancel() {
      this.isEdit = false
    },
    handleConfirm() {
      this.isEdit = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card {
    width: 500px;
    margin: 20px auto;
  }
  .image-box {
    width: 120px;
    margin: 0px auto;
  }
  .form-box {
    width: 350px;
    margin: 0px auto;
    /*background-color: #E65D6E;*/
  }
  .form-item {
    width: 350px;
    margin: 5px auto;
    /*background-color: #30B08F;*/
  }
  .input-box {
    width: 230px;
  }
  .button-box {
    margin-top: 5px;
    margin-left: 315px;
  }
  .button-box-else {
    margin-top: 5px;
    margin-left: 190px;
  }
</style>
