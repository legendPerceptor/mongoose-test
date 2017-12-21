//import { ObjectId } from '../../../../../.cache/typescript/2.6/node_modules/@types/bson';

//import { lchmod } from 'fs';

const expect=require('expect');
const request=require('supertest');

const{app}=require('../server');
const{Todos}=require('../models/todos');

//const todos=[{text:'First test todo'},{text:'Second test todo'}];

const {ObjectID}=require('mongodb');
const todos=[{
    _id:new ObjectID(),
    text:'First test todo'
},{
    _id:new ObjectID(),
    text:'Second test todo'
}];

beforeEach((done)=>{
    Todos.remove({}).then(()=> {
        return Todos.insertMany(todos);
    }).then(()=>{
        done();
    });
});

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        let text='Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                    //return to stop the function exec
                }

                Todos.find().then((todos)=>{
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((e)=>{
                    done(e);
                });
            });
    });

    it('should not create todo with invalid body data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todos.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });
});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

});

describe('GET /todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                //console.log(res.body);

                expect(res.body.todos._id).toEqual(todos[0]._id.toHexString());
            })
            .end(done);
            
    });
    it('should return 404 if todo not found',(done)=>{
        let hexId=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404).end(done);
            
    });

    it('should return 404 for non-object ids',(done)=>{
        request(app).get(`/totos/2344`)
            .expect(404).end(done);
            
    });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        request(app)
            .delete(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res)=>{
                console.log(res.body);
                expect(res.body.todo._id).toEqual(todos[0]._id.toHexString());
            }).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todos.findById(todos[0]._id).then((todo)=>{
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e)=>{
                    done(e);
                });
            });
        //  expect null 
    });
    
    // it('should get null if findbyid',(done)=>{
    //     Todos.findById(todos[0]._id).then((todo)=>{
    //         expect(todo).toNotExist();
    //         done();
    //     }).catch((e)=>{
    //         done(e);
    //     });
    // });

    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete(`/toto/${new ObjectID()}`)
            .expect(404).end(done);
    });

    it('should return 404 if object id is invalid',(done)=>{
        request(app)
            .delete(`/todo/luyuzhousb`)
            .expect(404).end(done);
    });
});