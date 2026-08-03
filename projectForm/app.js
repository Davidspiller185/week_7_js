import express from "express"
import path from "path"
import fs from 'fs/promises'
import { asyncWrapProviders } from "async_hooks"
import { json } from "stream/consumers"

const app = express()

app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    try{
        res.sendFile(path.join(process.cwd(),'index.html'))
    }
    catch(err){
        res.status(500).json({error:"error to load page"})
    }
})

app.post("/contact",async(req,res)=>{
    try{
        const{name,email,subject,message} = req.body
        if(!name || !email || !subject || !message){
            return res.status(400).json({error:"must to send name,email,subject,message"})
        }
        console.log(req.body)
        const createdAt =new Date().toISOString()
        const data = await fs.readFile('./db.json',"utf-8")
        const toArray = JSON.parse(data)
        let id = toArray.length + 1
        const object = {id,...req.body,createdAt}
        toArray.push(object)
        await fs.writeFile('./db.json',JSON.stringify(toArray,null,4))
        res.status(201).json({message:"success to save your contact"})
    }
    catch(err){
        res.status(500).json({message:"internal server error"})
    }
})

app.get("/admin",async(req,res) =>{
    try{
        const table = await fs.readFile('./table.html',"utf-8")
        const data = await fs.readFile('./db.json',"utf-8")
        const toArray = JSON.parse(data)
        let rows = ""
        for(const item of toArray){
            rows+= `
            <tr>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.subject}</td>
                <td>${item.message}</td>
                <td>${item.createdAt}</td>
            </tr>`
        }
        const finalHtml = table.replace(
            "<!--CONTACT_ROWS-->",
            rows
        )
        res.send(finalHtml)
    }
    catch(err){
        res.status(500).json({error:"internal server error"})
    }
})

app.delete("/contact",async(req,res)=>{
    try{
        const {id} =req.query
        if(!id){
            return res.status(400).json({error:"must to send query id"})
        }
        const data = await fs.readFile("./db.json","utf-8")
        const toArray = JSON.parse(data)
        const Filter = toArray.filter(row => row.id !== Number(id))
        await fs.writeFile("./db.json",JSON.stringify(Filter,null,4))
        res.status(200).json({message:"deleted succsses"})
    }
    catch(err){
        res.status(500).json({error:"internal server error"})
    }

})

app.listen(3000,()=>{
    console.log("server lisening on port 3000")
})


