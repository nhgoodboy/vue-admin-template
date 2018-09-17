/**
 * Created by silianghyrlh on 2017/3/14.
 */
/**
 * Created by silianghyrlh on 2017/3/11.
 */
const http = require('http')
const querystring = require('querystring')
const crypto = require('crypto')
const fs = require('fs')
// 订单信息;
const req_data = function(user_id, waresid) {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10)
  }
  const cporderid = Date.now().toString() + code
  let IAppPaySDKConfig = {
    'appid': '自己的',
    'waresid': parseInt(waresid),
    'cporderid': cporderid,
    'currency': 'RMB',
    'appuserid': user_id,
    'notifyurl': '自己的'
  }
  // 私钥；
  let privateKey = fs.readFileSync('./rsa_private_key.pem')
  privateKey = privateKey.toString()
  IAppPaySDKConfig = JSON.stringify(IAppPaySDKConfig)
  // 签名；
  let sign = crypto.createSign('RSA-MD5')
  sign.update(IAppPaySDKConfig)
  sign = sign.sign(privateKey, 'base64')
  sign = encodeURI(sign)
  const result_data = 'transdata=' + IAppPaySDKConfig + '&sign=' + sign + '&signtype=RSA'
  return result_data
}

// 发送请求
const post_data = function(postData) {
  const options = {
    hostname: 'https://cp.iapppay.com/payapi/order',
    method: 'POST',
    header: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  return new Promise(function(resolve, reject) {
    const req = http.request(options, function(res) {
      res.setEncoding('utf-8')
      let gateway = null
      res.on('data', function(chun) {
        console.log('body分隔线---------------------------------\r\n')
        chun = decodeURI(chun)
        let transid = querystring.parse(chun)['transdata']
        transid = JSON.parse(transid)['transid']
        console.log('transid', transid)
        gateway = gate_way_pay(transid)
      })
      res.on('end', function() {
        resolve(gateway)
        console.log('No more data in response.********')
      })
    })
    req.on('error', function(err) {
      reject(err)
      console.error(err)
    })
    req.write(postData)
    req.end()
  })
}
// 生成网关地址；
const gate_way_pay = function(tid) {
  let gate_way_data = {
    'tid': tid,
    'app': '自己的',
    'url_r': '自己的',
    'url_h': '自己的'
  }
  let privateKey = fs.readFileSync('./rsa_private_key.pem')
  privateKey = privateKey.toString()
  gate_way_data = JSON.stringify(gate_way_data)
  const gate_way_data_1 = encodeURI(gate_way_data)
  let sign = crypto.createSign('RSA-MD5')
  sign.update(gate_way_data)
  sign = sign.sign(privateKey, 'base64')
  sign = encodeURIComponent(sign)
  const result_data = 'https://web.iapppay.com/pay/gateway?' + 'data=' + gate_way_data_1 + '&sign=' + sign + '&sign_type=RSA'
  return result_data
}
exports.payment = function(user_id, waresid, callback) {
  const postData = req_data(user_id, waresid)
  post_data(postData).then(function(data) {
    callback(data)
  }).catch(function(error) {
    console.log(error)
  })
}
