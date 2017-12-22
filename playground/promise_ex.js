
let func1=new Promise((resolve,reject)=>{
    let password="123456";
    resolve(password);
});

// func1.then((pass)=>{
//     console.log(pass);
//     return func1.then((pass)=>{
//         //return pass+"fs";
//         return new Promise((resolve,reject)=>{
//             resolve(pass+'js');
//         });
//     });
// }).then((pass)=>{
//     console.log('Goddsss');
//     console.log(pass);
// });

// func1.then((pass)=>{
//     return pass+"fff1";
// }).then((pass2)=>{
//     return pass2+'2222';
// }).then((pass3)=>{
//     console.log(pass3);
// });
console.log('21424142411');
console.log(typeof (1 && func1));
