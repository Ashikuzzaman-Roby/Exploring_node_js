const express = require("express");
const app = express();
app.get("/",(req,res)=>{
    return res.send("Hello from roby");
});
app.get("/about",(req,res)=>{
    return res.send("from about page");
})

app.listen(8000,()=>{
    console.log(`server started`)
})