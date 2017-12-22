const {SHA256}=require('crypto-js');

let message='I am user number 3';
let hash=SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data={
    id:4
};
let token={
    data,
    hash:SHA256(JSON.stringify(data)+'somesecret').toString()
}
console.log(token);
console.log(token.hash.length);

token.data=5;
token.hash=SHA256(JSON.stringify(token.data)).toString();

let resultlHash=SHA256(JSON.stringify(token.data)+'somesecret').toString();

if(resultlHash===token.hash){
    console.log('Data was not changed');
}else{
    console.log('Data was changed');
}