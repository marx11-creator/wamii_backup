var CryptoJS = require('crypto-js');

//Encrypts
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
console.log('encrypted text ', ciphertext.toString());

var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log('decrypted text ', plaintext);