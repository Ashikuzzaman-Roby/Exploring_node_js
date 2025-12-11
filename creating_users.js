const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 8000;


// creating a middlewire : 

const db_config = {
    host : "localhost",
    user : "root", 
    password : "",
    database : "backend_practice"
}

const pool = mysql.createPool(db_config).promise();
pool.query("SELECT 1").then(()=>{
    console.log(`database has connected successfully`);
    

}).catch((err)=>{
    console.log(`${err}`);
})





app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello from roby");

})

app.get("/api/users",async (req, res)=>{
    const [result]=await pool.query("select * from users");
    res.json({
        status:`successful `,
        users : result

    });

})


// Mock table schema for reference:
/*
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    job_title VARCHAR(100),
    salary DECIMAL(10, 2)
);
*/


// making a database configuration : 
app.post("/api/users",async(req,res)=>{
    const {first_name,last_name,email,job_title,salary}=req.body;
    if(!first_name || !email || !job_title){
        return res.status(400).json({
            status: 'failed',
            msg: "requirement missing"
        });

    }
    try{
        let query = `INSERT IN users (first_name,last_name,email,job_title,salary) values(?,?,?,?,?)`
        const [result_1]=await pool.query(query,[first_name,last_name||null,email,job_title,salary||null]);
        res.status(201).json({
            status : "successful",
            msg: 'user created successfully',
            userId : result_1.insertId
    });

    }catch{
        console.error(err);
        // Handle potential duplicate key error (e.g., email unique constraint)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: 'failed', msg: `User creation failed: Duplicate entry for unique field (e.g., email)` });
        }
        res.status(500).json({
            status: 'failed',
            msg: `Database error during user creation: ${err.message}`
        });
    }
    


});

app.listen(PORT,()=>{
    console.log(`server is running`);
})