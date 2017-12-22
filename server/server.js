let env = process.env.NODE_ENV || 'development';
console.log('env *****',env);
if(env==='development'){
    process.env.PORT=3000;
    process.env.MONGODB_URI='mongodb://127.0.0.1:27017/Todos';
}else if(env==='test'){
    process.env.PORT=3000;
    process.env.MONGODB_URI='mongodb://127.0.0.1:27017/TodoAppTest';
}

let express=require('express');
let bodyParser=require('body-parser');
let _=require('lodash');
let {mongoose}=require('./db/mongoose');
let {User}=require('./models/user');
let {Todos}=require('./models/todos');
let {ObjectID}=require('mongodb');

let {authenticate}=require('./middleware/authenticate');

let app=express();
const port=process.env.PORT;

app.use(bodyParser.json());

app.post('/users',(req,res)=>{
        let body=_.pick(req.body,['email','password']);
        let user=new User(body);
        user.save().then(()=>{
            return user.generateAuthToken();
        }).then((token)=>{
            res.header('x-auth',token).send(user.toJSON());
        }).catch((e)=>{
            console.log(e);
            res.status(400).send(e);
        })

});
app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});


app.post('/todos',(req,res)=>{
    //console.log(req.body);
    let todo=new Todos({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
        
    })
});

app.get('/todos',(req,res)=>{

    Todos.find().then((todos)=>{
        //console.log(todos);
        res.send({todos});
    });
});
app.get('/todos/:Id',(req,res)=>{
    //res.send(req.params);
    let id=req.params.Id;
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todos.findById({_id:id}).then((todos)=>{
        if(!todos){
            return res.status(404).send();
        }
        res.send({todos});
    }).catch((e)=>{
        console.log(e);
        res.status(400).send();
    });
});

app.delete('/todos/:id',(req,res)=>{
    let id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todos.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        console.error(e);
        res.status(404).end();
    });
});

app.patch('/todos/:id',(req,res)=>{
    let id=req.params.id;
    //console.log(req.body);
    let body=_.pick(req.body,['text','completed']);
    //console.log(body);
    //console.log("excuse me?");
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt=new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt=null;
    }

    Todos.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>res.status(400).send());
});

app.listen(port,()=>{
    console.log('Started on port '+port);
});

module.exports={app};