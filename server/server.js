let express=require('express');
let bodyParser=require('body-parser');

let {mongoose}=require('./db/mongoose');
let {User}=require('./models/user');
let {Todos}=require('./models/todos');

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

app.listen(3000,()=>{
    console.log('Started on port 3000');
});

module.exports={app};