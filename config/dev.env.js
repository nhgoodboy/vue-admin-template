'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8081"',
  UPLOAD_URL: '"http://localhost:8081/admin/fileInf/upload"'
})
