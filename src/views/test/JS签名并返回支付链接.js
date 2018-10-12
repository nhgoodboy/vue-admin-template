/**
 * Created by xlfd on 2018/10/08.
 */
const https = require('https')
const querystring = require('querystring')
const crypto = require('crypto')
const fs = require('fs')

// 订单信息;
const req_data = function(appid, waresid, waresname, price, cporderid, appuserid, notifyurl) {
  let data = {
    'appid': appid,
    'waresid': waresid,
    'waresname': waresname,
    'price': price,
    'cporderid': cporderid,
    'currency': 'RMB',
    'appuserid': appuserid,
    'notifyurl': notifyurl
  }
  // 私钥;
  let privateKey = fs.readFileSync('./rsa_private_key.pem')
  privateKey = privateKey.toString()
  data = JSON.stringify(data)
  // 签名;
  let sign = crypto.createSign('RSA-MD5')
  sign.update(data)
  sign = sign.sign(privateKey, 'base64')
  const order_data = 'transdata=' + data + '&sign=' + sign + '&signtype=RSA'
  console.log('order_data：', order_data)
  return order_data
}

// 发送请求
const post_data = function(postData, appid, url_r, url_h) {
  const options = {
    hostname: 'cp.iapppay.com',
    port: 443,
    path: '/payapi/order/',
    method: 'POST',
    header: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  return new Promise(function(resolve, reject) {
    const req = https.request(options, function(resp) {
      resp.setEncoding('utf-8')
      let gateway = null
      resp.on('data', function(resp_data) {
        console.log(resp_data)
        // 验签
        const parse_data = querystring.parse(resp_data)
        console.log('parse_data: ', parse_data)
        const transdata = parse_data.transdata
        const sign = parse_data.sign.replace(/\s/g, '+') // replace还原sign正确格式,空格更换为加号,\s是空格,g是全部匹配
        console.log(sign)
        let publicKey = fs.readFileSync('./rsa_public_key.pem')
        publicKey = publicKey.toString()
        const verify = crypto.createVerify('RSA-MD5')
        verify.update(transdata)
        const mysign = verify.verify(publicKey, sign, 'base64')
        if (mysign) {
          // 验证成功
          console.log('verity success')
        } else {
          // 验证失败
          console.log('verity failed')
        }

        let transid = querystring.parse(resp_data)['transdata']
        transid = JSON.parse(transid)['transid']
        console.log('transid: ', transid)
        gateway = gate_way_pay(transid, appid, url_r, url_h)
      })
      resp.on('end', function() {
        resolve(gateway)
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

// 生成网关地址;
const gate_way_pay = function(transid, appid, url_r, url_h) {
  let gate_way_data = {
    'tid': transid,
    'app': appid,
    'url_r': url_r,
    'url_h': url_h
  }
  let privateKey = fs.readFileSync('./rsa_private_key.pem')
  privateKey = privateKey.toString()
  gate_way_data = JSON.stringify(gate_way_data)
  const gate_way_data_encode = encodeURI(gate_way_data)
  let sign = crypto.createSign('RSA-MD5')
  sign.update(gate_way_data)
  sign = sign.sign(privateKey, 'base64')
  sign = encodeURIComponent(sign)
  const result_data = 'https://web.iapppay.com/pay/gateway?' + 'data=' + gate_way_data_encode + '&sign=' + sign + '&sign_type=RSA'
  return result_data
}

exports.payment = function(appid, waresid, waresname, price, cporderid, appuserid, notifyurl, callback, url_r, url_h) {
  const postData = req_data(appid, waresid, waresname, price, cporderid, appuserid, notifyurl)
  post_data(postData, appid, url_r, url_h).then(function(data) {
    callback(data)
  }).catch(function(error) {
    console.log(error)
  })
}

