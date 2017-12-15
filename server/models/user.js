let mongoose=require('mongoose');

let User=mongoose.model('User',{
    'Name': {
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    'Email':{
        type:String,
        required:true,
        trim:true,
        minlength:5
    }
});

module.exports={
    User
};