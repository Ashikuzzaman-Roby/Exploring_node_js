const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const PORT = 8000;

const app= express();
app.get("/",(req,res)=>{
    return res.send(`Hello from home page`)
});


app.get("/about", (req,res)=>{
    return res.send(`Hey there !! Hello from Roby`);
    
});

app.get("/api/users", (req,res)=>{
    return res.json(users);
});



app.get("/users" , (req,res)=>{
    let  html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rest api creation</title>
        </head>
        <style> 
                body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; }
                ol {  padding: 0,margin-left:30px; }
                li { background: #fff; margin-bottom: 8px; padding: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                 
        </style>
        <body>
            <h1> All the users are given below </h1>
            <ol> 
                 ${
                     users.map((user) => `<li>${user.first_name}</li>`).join("")
                 }



            </ol>
        </body>
        </html>  
    `

    return res.send(html);
});



app.get("/user/id" , (req, res)=>{
    let html = 
    ` 
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <style> 
                body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; }
                ol {  padding: 0; margin-left:30px; }
                li { background: #fff; margin-bottom: 8px; padding: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                 
        </style>


        <body>
            <h1>User and Id of the users given below</h1>
            <ol>
                ${
                    // ✅ ম্যাপ ফিক্স: user.id এবং user.first_name একসাথে দেখানো হচ্ছে
                    users.map((user) => `
                        <li>
                            ID: <strong>${user.id}</strong> - 
                            Name: ${user.first_name}
                        </li>
                    `).join("")
                }
            </ol>
            
        </body>
        </html>
    `
    res.send(html);
})



app.get("/api/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=>{
          return Number(user.id) ===id
    });
    if(!user){
        return res.status(404).json({ error: "User not found" });

    }
    return res.json(user)
});


app.listen(PORT, ()=>{console.log(`Server is started ...`)});