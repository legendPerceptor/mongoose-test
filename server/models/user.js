//import { Promise } from 'mongoose';

const mongoose=require('mongoose');
const validator=require('validator');
const _=require('lodash');
const jwt=require('jsonwebtoken');
let UserSchema=new mongoose.Schema({

    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        unique:true,
        validate:{
            validator: (value)=>{return validator.isEmail(value)},
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});
UserSchema.methods.generateAuthToken= function(){
    try{
    let user= this;
    let access='auth';
    let token=jwt.sign({_id:user._id.toHexString(),access},'abc1234');
    user.tokens.push({access,token});
    
    return user.save().then(()=>{
        return token;
    });
    
    }catch(e){
        console.log(e);
        process.exit(1);
    }
}
UserSchema.methods.toJSON=function(){
    let user=this;
    let userObject=user.toObject();
    //There aren't too many differences when the object is simple
    //console.log('User Object:',userObject);
    //console.log('User itself:',user);
    return _.pick(userObject,['_id','email']);
}

UserSchema.statics.findByToken=function(token){
    let User=this;
    let decoded;
    try{
        decoded=jwt.verify(token,'abc1234');
    }catch(e){
        return new Promise((resolve,reject)=>{
            reject('Authentication Failed!');
        });
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

let User=mongoose.model('hiUser',UserSchema);

module.exports={
    User
};