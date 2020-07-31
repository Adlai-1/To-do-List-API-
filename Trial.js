const express = require('express')
const app = express()
const body = require('body-parser')
const graph = require('graphql')
const {gql,makeExecutableSchema, ApolloServer} = require('apollo-server-express')
const brcy = require('bcrypt')
const{Model_User} = require('./Models/User')
const{Model_Task} = require('./Models/Tasks')
app.use(body.json)

//Server to allow Users Signup to the App....

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
    Activity:String!
    Objective:String!
    Username:String!
    Date_of_Completion:Date
    createdAt:Date
    updatedAt:Date
}

type Query{
    text:String
    User(username:String!):Users
    
}

`
const Resolvers = {
    Query:{
        text:()=>"Hello to Apollo"
    }
}

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

const schema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers:Resolvers
})

const Apollo = new ApolloServer({playground:true,introspection:true,schema})

Apollo.applyMiddleware({app,bodyParserConfig:true})

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{console.log("Server Up and Running!")})