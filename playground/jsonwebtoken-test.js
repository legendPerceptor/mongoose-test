const {SHA256}=require('crypto-js');

const jwt=require('jsonwebtoken');

let data={
    id:10
};
let token=jwt.sign(data,'123trtyc');
console.log(token);
console.log(token.length);

let decoded=jwt.verify(token,'123trtyc');
console.log('decoded',decoded);