<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="image-box">
        <pan-thumb :image="avatar" width="120px" height="120px">
          <el-upload
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :show-file-list="false"
            :with-credentials="true"
            :headers="tokenHeader"
            :action="uploadUrl">
            {{ $t('profile.change_avatar') }}
          </el-upload>
        </pan-thumb>
      </div>
      <el-form ref="form" :model="form" :rules="editRules" :inline-message="true" class="form-box">
        <el-form-item :label-width="formLabelWidth" :label="$t('table.account')" class="form-item">
          <el-input v-if="isEdit" v-model="form.account" :disabled="true" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.account }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.name')" prop="name" class="form-item">
          <el-input v-if="isEdit" v-model="form.name" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.name }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.sex')" prop="sex" class="form-item">
          <el-select v-if="isEdit" v-model="form.sex" class="input-box">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
          <div v-else class="text-box">{{ userInfo.sex }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.role')" class="form-item">
          <el-input v-if="isEdit" v-model="form.role" :disabled="true" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.role }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.dept')" class="form-item">
          <el-input v-if="isEdit" v-model="form.dept" :disabled="true" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.dept }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.email')" class="form-item" prop="email">
          <el-input v-if="isEdit" v-model="form.email" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.email }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.phone')" class="form-item" prop="phone">
          <el-input v-if="isEdit" v-model="form.phone" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.phone }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.birthday')" class="form-item">
          <el-date-picker
            v-if="isEdit"
            v-model="form.birthday"
            class="input-box"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"/>
          <div v-else class="text-box">{{ form.birthday }}</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('table.createTime')" prop="createTime" class="form-item">
          <el-input v-if="isEdit" v-model="form.createTime" :disabled="true" class="input-box"/>
          <div v-else class="text-box">{{ userInfo.createTime }}</div>
        </el-form-item>
        <el-form-item class="button-form-item">
          <el-button v-if="!isEdit" type="primary" @click="handleEdit">{{ $t('table.edit') }}</el-button>
          <div v-else>
            <el-button @click="handleCancel">{{ $t('table.cancel') }}</el-button>
            <el-button type="primary" @click="handleConfirm('form')">{{ $t('table.confirm') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { mapGetters } from 'vuex'
import { editUserInfo, changeAvatar } from '@/api/userInfo'

export default {
  components: { PanThumb },

  data() {
    const validatePhone = (rule, value, callback) => {
      // 手机号码正则表达式
      const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (value.trim() && !reg.test(value)) {
        callback(new Error('请输入正确的电话'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      // 邮箱正则表达式
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (value.trim() && !reg.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      form: {},
      isEdit: false,
      editRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入性名' }],
        sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
        email: [{ required: false, trigger: 'blur', validator: validateEmail }],
        phone: [{ required: false, trigger: 'blur', validator: validatePhone }]
      },
      formLabelWidth: '100px',
      oldAvatar: '',
      tokenHeader: { Authorization: '' },
      uploadUrl: process.env.UPLOAD_URL
    }
  },

  computed: {
    ...mapGetters(
      { userInfo: 'userInfo', avatar: 'avatar' }
    )
  },

  created() {
  },

  mounted() {
    this.form = Object.assign({}, this.userInfo)
    this.tokenHeader.Authorization = 'Bearer ' + this.userInfo.token
  },

  methods: {
    uploadError(err, file, fileList) {
      console.info(err)
    },
    uploadSuccess(response, file, fileList) {
      this.oldAvatar = this.avatar
      changeAvatar(response.data.fileInfId).then(response => {
        this.$store.commit('SET_AVATAR', process.env.BASE_API + response.data)
      })
    },
    handleEdit() {
      this.form = Object.assign({}, this.userInfo)
      this.isEdit = true
      this.$nextTick(() => { // 清空验证
        this.$refs['form'].clearValidate()
      })
    },
    handleCancel() {
      this.isEdit = false
      this.$nextTick(() => { // 清空验证
        this.$refs['form'].clearValidate()
      })
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const reqForm = {
            token: this.form.token,
            name: this.form.name,
            sex: this.form.sex,
            email: this.form.email,
            phone: this.form.phone,
            birthday: this.form.birthday
          }
          editUserInfo(reqForm).then(response => {
            this.isEdit = false
            this.$store.dispatch('GetInfo').then(res => {}).catch(() => {}) // 拉取用户信息
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
  }
  .form-item {
    width: 350px;
    margin: 5px auto;
  }
  .input-box {
    width: 230px;
  }
  .text-box {
    width: 230px;
    margin-left: 10px;
  }
  .button-form-item {
    margin-top: 5px;
    padding-right: 20px;
    float: right;
  }
</style>
