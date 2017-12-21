let {MongoClient}=require('mongodb');
let assert=require('assert');
let yargs=require('yargs');
let fs=require('fs');

let argv=yargs.command('insert','Insert one record to User',{
    name:{
        alias:'n',
        default: 'NewComer'
    },
    identity:{
        alias:'id',
        demand:true
    },
    schoolID:{
        alias:'sid',
        demand:true
    }
})
.command('deleteOne','Delete one user!(一键退潮)',{
    name:{
        alias:'n',
        demand:true
    },
    schoolID:{
        alias:'sid',
        demand:true
    },
    identity:{
        alias:'id',
        demand:true
    }
}).command('modifyOne',"modify one's infomation",{
    name:{
        alias:'n',
        demand:true
    },
    identity:{
        alias:'id',
        demand:true
    },
    schoolID:{
        alias:'sid',
        demand:true
    }
}).command('list','list all people\'s information',{
    
})
.help()
.alias({'help':'h',
    'list':'l',
    'insertOne':'i',
    'modifyOne':'u',
    'deleteOne':'d'
})
.argv;

console.log(argv);
//if(!(argv.d||argv.i||argv.l||argv.u))process.exit(0);
//console.log(argv.d||0+argv.i||0+argv.l||0+argv.u||0);
if((argv.d||0+argv.i||0+argv.l||0+argv.u||0)!=1)process.exit(0);
MongoClient.connect('mongodb://127.0.0.1:27017',(err,client)=>{
    try{
    let db=client.db('QSC_HR');
    assert.equal(null,err);
    console.log('Connected successfully to mongodb server!Authurized access only!');
    console.log('This mode is for administrator!');
    if(argv.l){
        db.collection('members').find().toArray().then((result)=>{
            result=result.filter((item)=>{
                if(item.name=='admin')return 0;
                else return 1;
            })
            console.log(JSON.stringify(result,undefined,2));
        }).catch((err)=>{
            console.error('Failed to list all members\' information');
            HR_writelog(err);
        });    
    }else if(argv.i){
        db.collection('members').insertOne({
            name:argv.name,
            identity:argv.identity,
            schoolID:argv.schoolID
        }).then((result)=>{
            console.log(`The following member has been successfuly added.\n ${JSON.stringify(result.ops,undefined,2)}`);
        }).catch((err)=>{
            console.error('Failed to insert the data!');
            HR_writelog(err);
        });
    }else if(argv.d){
        db.collection('members').deleteOne({
            name:argv.name||undefined,
            identity:argv.identity,
            schoolID:argv.schoolID
        }).then((result)=>{
            if(result.deletedCount===1)
                console.log('Successfully deleted!');
            else if(result.deletedCount===0)
                console.log('Already not exsist!');
        }).catch((err)=>{
            console.error('Failed to delete the data!');
            HR_writelog(err);
        });
    }else if(argv.u){
        db.collection('members').updateOne({name:argv.name},
            {$set:{name:argv.name,
                identity:argv.identity,
                schoolID:argv.schoolID}
            }).then((result)=>{
                console.log('Successfully updated the database!');
                console.log(result);
            }).catch((err)=>{
                HR_writelog(err);
            });
    }
    }catch(e){
        HR_writelog(e);
        console.error('Can\'t connect to database');
        process.exit(1);
        //return;
    }
    

    client.close();
});
//createCollection
let createCapped=(db,callback)=>{
    db.createCollection("HumanResource",
    {"Age":19,"Name":"Hython",},
    (err,results)=>{
        console.log('Collection created.');
        callback();
    });
}
let HR_writelog=(message)=>{
    let time=new Date().toUTCString();
    let data=time+message+'\n';
    fs.appendFile('./logs/hr_log.txt',data,(err)=>{
        if(err){console.error('failed to write to hr_log.txt');}
    })
}