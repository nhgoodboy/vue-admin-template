// 接受到post请求(我用的是express框架);
const querystring = require('querystring')

app.post('/回调通知地址', function(req, res) {
  console.log('pay_server_callback')
  const body_notify = req.body
  // 测试回调通知(正式版可以删掉);
  if (isEmptyObject(body_notify)) {
    console.log('req.body is emtpy')
    let postData = ''
    req.on('data', function(data) {
      postData += data
      postData = decodeURI(postData)
      postData = querystring.parse(postData)
      const transdata_string = postData['transdata']
      transdata_obj = JSON.parse(transdata_string)
      const sign = postData['sign']
      const signtype = postData['signtype']
      let publicKey = fs.readFileSync('./rsa_public_key.pem')
      publicKey = publicKey.toString()
      const crypto_1 = require('crypto')
      const verify = crypto_1.createVerify('RSA-MD5')
      verify.update(transdata_string)
      const mysign = verify.verify(publicKey, sign, 'base64')
      if (mysign) {
        // 交易成功
        console.log('success')
        res.send('success')
      } else {
        // 交易失败
        console.log('failed')
      }
    })
    req.on('end', function() {
      console.log('post end')
    })
    return
  }
  console.log(body_notify)
  const transdata = body_notify.transdata
  const sign = body_notify.sign
  const signtype = body_notify.signtype

  let publicKey = fs.readFileSync('./rsa_public_key.pem')
  publicKey = publicKey.toString()

  const crypto_1 = require('crypto')
  const verify = crypto_1.createVerify('RSA-MD5')
    verify.update(transdata)
  const mysign = verify.verify(publicKey, sign, 'base64')

  console.log('mysign', mysign)
  if (mysign) {
    console.log('verity success')
    res.send('success')
  } else {
    // 交易失败
    console.log('verity failed')
    res.send('failed')
  }
})
