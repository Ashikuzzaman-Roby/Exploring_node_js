const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8000;
const users = require("./MOCK_DATA.json");

console.log(users);



app.get("/",(req,res)=>{
    res.send(`Hello from Home page`);
});

app.get("/about"  , (req,res)=>{
    res.send(`Roby this side`);
});


app.get("/api/users", (req,res)=>{
    res.json(users);
});


app.get("/users",(req,res)=>{
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
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
                users.map((user)=>`
                <li> 
                    Name : ${user.first_name}
                    Id : ${user.id}
                </li>
                
                `).join("")
             }
        
        </ol>

    </body>
    </html>
    
    
    `
    res.send(html);
})



app.get("/users/:id" , (req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=>{
        return Number(user.id)===id

    });
    if(!user){
        return res.send(`user Not found`)
    }

    const name = user.first_name ;
    const job_title = user.job_title;
    return res.send(`
        ${id} \n${name} : ${job_title}
        `);
});

app.use(express.json()); 
app.use(express.urlencoded({extended : false})); 

app.post("/api/users",(req,res)=>{
    const body = req.body;
    console.log("BOdy : ",body)
    users.push({...body, id:users.length+1});
    // console.log(users);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err,data)=>{
        if(err){
            return res.send(`invalid request`)
        }
        return res.json({"status" : "successful",id: users.length});
    })
    
});



app.listen(PORT,()=>{console.log(`Server has started .... `)});