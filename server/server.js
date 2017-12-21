let express=require('express');
let bodyParser=require('body-parser');

let {mongoose}=require('./db/mongoose');
let {User}=require('./models/user');
let {Todos}=require('./models/todos');
let {ObjectID}=require('mongodb');

let app=express();
app.use(bodyParser.json());
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
    }else{
        console.log(id);
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


app.listen(3000,()=>{
    console.log('Started on port 3000');
});

module.exports={app};