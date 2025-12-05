const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 8000;



// making a database configuration : 

db_config = {
    host  : 'localhost',
    user : 'root',
    password : "", 
    database : "CSE370Lab01"

};

// linking a connection with this pool 

const pool = mysql.createPool(db_config).promise();

pool.query("SELECT 1").then(()=>{
    console.log(`database Connected successfully`);


}).catch((err)=>{
    console.error(`there are some error : ${err}`);
    process.exit(1);
});



app.get("/",(req,res)=>{
    res.send(`<h1> Hello from Roby</h1>`);
});

app.get("/api/users", async (req,res)=>{
    let  [val]= await pool.query("select * from lab_grades");
    try{
        res.status(200).json({
            status : "successful",
            users : val
        }
            

        );
    }catch(err){
        res.status(500).json({
            status : 'failed',
            msg : `${err}`

        });
    }
    
});



app.get("/api/users/:id",async (req,res)=>{
    let userId = req.params.id;
    userId =`s00${userId}`
    let [val]=await pool.query("select * from lab_grades where std_id=${userId}");
    try{
        res.status(200).json({
            status : "successful",
            user : val 

        });
    }
    catch(err){
        res.status(500).json({
            status : 'failed',
            msg : `${err}`

        });
    }

})



app.listen(PORT, () => {
    console.log(`Server is running ....`);
});

