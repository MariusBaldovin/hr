const CryptoJS = require("crypto-js");
const iv = CryptoJS.enc.Utf8.parse("zh9sx56s7wg3d0gu");
const key = CryptoJS.enc.Utf8.parse("x56sd0gu7wg3zh9s");

function encrypt(data) {
  var result = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return result.toString(CryptoJS.enc.Utf8);
}

function decrypt(data) {
  var result = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(data) },
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return JSON.parse(result.toString(CryptoJS.enc.Utf8));
}

module.exports = { encrypt, decrypt };
