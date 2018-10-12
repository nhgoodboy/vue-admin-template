const js_sign = require('./JS签名并返回支付链接')

// 以下内容为测试
const callback = function(data) {
  console.info('支付链接: ' + data)
}
//注意数据类型
const appid = '3021150646'
const waresid = 1
const waresname = 'test'
const price = 0.01
const cporderid = Date.now().toString() + parseInt(Math.random() * 100000)
const appuserid = 'user_one'
const notifyurl = ''
const url_r = 'https://www.baidu.com'
const url_h = 'https://www.baidu.com'

js_sign.payment(appid, waresid, waresname, price, cporderid, appuserid, notifyurl, callback, url_r, url_h)

// 生成.pem文件内容
// const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9nsgzoRXLjHHIaVnl+zTS+y3vZFEhyLSxRKOKhix30CV/IkwocJZnuoJRb+6dWw47RfTdUurb/r2d2nwCIsdVIBmQC+xNgZFaJ/sPWa/JVzfPQgw+OY4MMQj6VVl4Ok8o2pSaXCgLxG9lhHghKjr/dwmLAcnPs6dsyznrQ+2u2wIDAQAB'
// const privateKey = 'MIICXAIBAAKBgQDpoAZxONnW2o9VqDJDa9bl7vV0Ywxu/nYhsXFHijc0O0gr37h1jMp2eJ+rgLr/2MtwiYooPcgJ79MPN4NEy+QiQzJj/JgSZrpm3tBp03ZxyJRI6TzF2dj2pYf2GlCZ+afft3S0pV9PQVjoNjgy3omBmjitEjJu76f++NHRWuhi6wIDAQABAoGAE9hbE70PjBeuu0j5VA7SB2AgC43qXXdSE5SeGcSc4dvzSn7LjXizLhMbBRd/SwJgbaPRT4/H8Ugk9pLxnKNxMmpUixqcltX214iZyzn1PmTSavzAV2plXQPhZAIYd4098iFmX+5rREgCesTmbv4DcXWCPE9IEcUFGHD6NOah7dECQQD0l1mP24mBkyPvA5P4xeH/ujp/d2VRaPCyc/QtY34Oy6hflnMU4+gDJ3CE4Ww8GHCOy9CaTmVMnoJHoUv005cjAkEA9IW6xWkBQlWXe7ffwKPyDVUfJN61EOLUXb7NS8WfuX7Byfr7TvGlLCHL911+paP/HNJb6mwymwq1HNt0NSklmQJAY/IkquAuxD/4AwcXRCS4QOM8XDHRuP6EvKcdNB7ft/QIjWbRB8xJVmCbXfEvZS8nb3Jhf2xhgHmVCugiPZzouQJAb37G0hr2KwQSJaSLDzDyPugQYmR2VXPId9J3k9RR52gH/wxFKRMASKZEdc+Y3vhva/nzVWnujUmNmdHrJA5WCQJBAJkYWmKRNlHMewVmsddxzGNYrq4bwd1/KAbF+Crj0aWZyOA3LfbGC3bhs6yLJ47QeDcyEOcuYVIERLJH5D94d2k='
// const needConvert = publicKey
// let convertedData = ''
// let index = 0
// while (needConvert.length > index) {
//   convertedData = convertedData + needConvert.substr(index, 64) + '\n'
//   index += 64
// }
// const pemData = '-----BEGIN RSA PRIVATE KEY-----' + '\n' + convertedData + '-----END RSA PRIVATE KEY-----'
// const pemData = '-----BEGIN PUBLIC KEY-----' + '\n' + convertedData + '-----END PUBLIC KEY-----'
// console.log('pemData:\n' + pemData)
