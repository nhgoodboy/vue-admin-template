<template>
  <div>
    <el-dialog :visible="visible" :title="$t('button.permissionConfig')" :close="handleClose" width="50%">
      <el-tree
        :props="props"
        :load="loadNode"
        lazy
        show-checkbox
        @check-change="handleCheckChange"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionConfigDialog = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="submitPermissionConfig()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Tree',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      // visible1: false,
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1
    }
  },

  computed: {
    visible1: {
      // getter
      get: function() {
        // let value = this.visible
        return this.visible
      },
      // setter
      set: function(newValue) {
        this.$emit('myEvent')
      }
    }
  },

  // watch: {
  //   visible: function(val) {
  //     this.isVisible = val
  //   }
  // },

  methods: {
    handleClose() {
      this.$emit('close')
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }])
      }
      if (node.level > 3) return resolve([])

      let hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }

      setTimeout(() => {
        let data
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }]
        } else {
          data = []
        }

        resolve(data)
      }, 500)
    }
  }
}
</script>
