const {mongoose}=require('../server/db/mongoose');
const {Todos}= require('../server/models/todos');

let id='5a33cfe231a8e567aeb66325';

Todos.findById({_id:id}).then((todos)=>{
    if(!todos){
        return console.log("Can't find the element!");
    }
    console.log(JSON.stringify(todos,undefined,2));
});
