import express from "express"

const app = express()

app.use(express.urlencoded({extended:true}))

app.post("/register",(req,res)=>{
    console.log(req.body)
    const {name,email,role} = req.body
    if(!name || !email){
        return res.status(400).json({error:'must to send name and email'})
    }
    res.status(201).json({message:'you are registed',user:{name,email,role}})
})

app.listen(3000,()=>{
    console.log("server lising on port 3000")
})