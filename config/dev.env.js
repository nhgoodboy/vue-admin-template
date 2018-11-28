'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:8081"',
  BASE_API: '"http://104.199.198.38:8082"',
  // UPLOAD_URL: '"http://localhost:8081/admin/fileInf/upload"'
  UPLOAD_URL: '"http://104.199.198.38:8082/admin/fileInf/upload"'
})
