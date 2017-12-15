let {MongoClient}=require('mongodb');
MongoClient.connect('mongodb://127.0.0.1:27017',(err,client)=>{

    let db=client.db("ToDoApp");
    // insertOne
    
   
    // find
    //   db.collection('User').find().toArray().then((result)=>{
    //     console.log(result); 
        
    //   }).catch(err => console.log(err));
    
    //   db.collection('User').updateOne({Name:'Xuanxuan'},
    //      {$set:{Name:'HuQixuan',Age:"20"}}).then((result)=>{
    //          console.log(result);
    //      });

    // deleteMany
    // db.collection('User').deleteMany({Name:"Hython"}).then((result)=>{
    //     console.log(result);
    // });
    // deleteOne
     db.collection('User').deleteOne({Name:"JiLi"}).then((result)=>{
         console.log(result);
     });
    //findOneAndDelete
    // db.collection('User').findOneAndDelete({Name:"Hython"}).then((result)=>{
    //     console.log(result);
    // });
    // MongoClient.collection('User').findOneAndDelete({});
    
    // db.collection('User').findOneAndUpdate({Name:"Keao"},
    // {$set:{Name:"Yuanjian",age:"19"}
    // }
    // ).then((result)=>{
    //     console.log(result);
    // });
    // db.collection('User').replaceOne({Name:"Yuanjian"},{Name:"Yuanjian",age:19}).then((result)=>{
    //     console.log(result.ops);
    // });
    client.close();
});