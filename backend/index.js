import "dotenv/config"
import cors from "cors"
import express from "express"
import session from "express-session";
import {readFile,writeFile} from "fs/promises"
import bcrypt from "bcrypt";
const app=express()
app.use(express.json)
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:63342/",
    credentials: true
}))


app.use(
    session({
        secret: "super-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60
        }
    })
);

let users=[
    {id:1,login:"mery@gmil.com",password:"1234"}
]

app.get("/login", (req, res) => {
    const { login, password,email,isAdmin } = req.query;
    const usersValues = users.find(user => user.login.toLowerCase() === login.toLowerCase() && user.password === password)
    if (usersValues) {
        let newUser={...usersValues}
        delete newUser.password
        req.session.user = newUser
        return res.json(newUser);
    }
    return res.json({
        error: "invalid login or password"
    });
});
app.post("/register", async (req,res)=>{
    const{name,email,password,isAdminEl}=req.body

    if(!name||!email||!password){
      return  res.status(400).json({massage:"invalid email or password or name"})
    }

    const hashedPassword= await bcrypt.hash(password,10)

    let val={id:Date.now(),name,email,password:hashedPassword,role:isAdminEl?"admin":"user"}

    let data=await readFile("user.json","utf-8")
    data=JSON.parse(data)
    data.push(val)
    await writeFile("users-json",JSON.stringify(data,null,2),"utf-8")


    delete val.password
    req.session.user={
        newValue:val
    }
    res.json(val)

})


app.get("/profile", (req, res)=>{

    if(req.session.user){
        return res.json(req.session.user)
    }
    res.json({message:"not logged in"})

})

app.get("/logout", (req, res)=>{

    if(req.session.user){
        req.session.user=null
        return res.json("logout user")
    }
    res.json({message:"not logged in"})

})


app.get("/admin", (req, res)=>{

    if(req.session.user.newValue.role==="admin"){

        return res.json(users)
    }
    res.json({message:"not logged in"})

})


app.get("/check/:psw", async (req, res)=>{
    const {psw}=req.params

    const isMatch=await bcrypt.compare(psw,)
        if(isMatch){
            return res.json("josht email or password")
        }
        res.json({message:"not logged in"})
})



app.listen(process.env.APP_PORT,()=> console.log("Server is running"))