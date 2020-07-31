const express = require('express')
const app = express()
const {gql,makeExecutableSchema, ApolloServer} = require('apollo-server-express')
const brcy = require('bcrypt')
const { Model_User } = require('./Models/User')
const {Model_Task} = require('./Models/Tasks')
const body = require('body-parser')
const { json } = require('body-parser')

app.use(body.json())

const Schema = gql`

scalar Date

type Users{
    Name:String!
    Email:String!
    Username:String!
    Password:String!
    createdAt:Date!
    updatedAt:Date!
}

type Tasks{
    _id:String!
    Activity:String!
    Objective:String!
    Username:String!
    Date_of_Completion:Date!
    createdAt:Date!
    updatedAt:Date!
}

type Query{
    text:String
    User(username:String!):Users
    Task(username:String!):[Tasks]   
}


type Mutation{
    Create(Activity:String!
        Objective:String!
        Username:String!
        Date_of_Completion:Date):Tasks
        
    Delete(id:String!):Tasks

    Edit(Activity:String
        Objective:String
        Date_of_Completion:Date
        Id:String!):Tasks
}
`
const Resolvers = {
    Query:{
        text:()=>"Hello to Apollo",

        User:(parent,{username})=>Model_User.findOne({Username:username},(err,res)=>{
            if(res) return res
            else return err
        }),

        Task:(parent,{username})=>Model_Task.find({Username:username},(err,res)=>{
            if(res) return res
            else return err
        })
    },

    Mutation:{
        Create:(parent,args)=>{
            const file = new Model_Task(args)
            return file.save()
        },

        Delete:(parent,{id})=>Model_Task.findByIdAndDelete(id,(err,res)=>{
            if(res) return res
            else return err
        }),

        Edit:(parent,{Id,Activity,Objective,Date_of_Completion})=>Model_Task.findByIdAndUpdate({_id:Id},
            {$set:{Activity:Activity,Objective:Objective,Date_of_Completion:Date_of_Completion}},(err,doc)=>{
                if(doc) return doc
                else return err
            })
    }
}

const schema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers:Resolvers
})

const Apollo = new ApolloServer({playground:true,introspection:true,schema})

Apollo.applyMiddleware({app,bodyParserConfig:true})

//User Signup.......
app.post('/Signup',(req,res)=>{
    brcy.genSalt(10,(err,salt)=>{
        if(salt){
            brcy.hash(req.body.Password,salt,(err,hash)=>{
                if(hash){
                   const file = new Model_User({
                       Name: req.body.Name,
                       Email:req.body.Email,
                       Username:req.body.Username,
                       Password:hash
                   })
                   file.save((err,doc)=>{
                       if(doc){res.sendStatus(200)}
                       else{res.send({Erro:"Unable to Signup!"})}
                   })
                }
                return err
            })
        }
        return err
    })
})

//User Login.....
app.post('/Login',(req,res)=>{
    Model_User.findOne({Username:req.body.Username},(err,suc)=>{
        if(suc){
            brcy.compare(req.body.Password,suc.Password,(err,same)=>{
                if(same){
                    res.json({Login:'True'})
                }
                else{
                    res.json({Login:"Wrong Password"})
                }
            })
        }
        else{
            res.json({Login:"Username not found!"})
        }
    })
})

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{console.log("Done!")})