let mongoose=require('mongoose');

let Todos=mongoose.model('Todos',{
    text:{
        type:String,
        required:true,
        minlength:1
    },
    completed:{
        type:Boolean
    },
    completedAt:{
        type:Number
    }
});

module.exports={
    Todos
};