const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 8000;

// Middleware to parse incoming JSON requests (Required for POST/PUT)
app.use(express.json());

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
const db_config = {
    host: 'localhost',
    user: 'root',
    password: "", 
    database: "CSE370Lab01"
};

// linking a connection with this pool 
const pool = mysql.createPool(db_config).promise();

pool.query("SELECT 1").then(() => {
    console.log(`Database Connected successfully`);
}).catch((err) => {
    console.error(`There was an error connecting to the database: ${err.message}`);
    process.exit(1);
});

// --- Read (GET) Operations ---

app.get("/", (req, res) => {
    res.send(`<h1> Hello from Roby - CRUD Server</h1>`);
});

// GET all users (assuming lab_grades is now 'users' for CRUD)
app.get("/api/users", async (req, res) => {
    try {
        // Querying a mock 'users' table for simplicity, maintaining the original structure
        const [users] = await pool.query("SELECT * FROM users"); 
        res.status(200).json({
            status: "successful",
            users: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'failed',
            msg: `Error retrieving users: ${err.message}`
        });
    }
});

// GET user by ID
app.get("/api/users/:id", async (req, res) => {
    const userId = req.params.id;
    // IMPORTANT: Use parameterized query (?) to safely insert values and prevent SQL Injection
    const [val] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]); 
    try {
        if (val.length === 0) {
             return res.status(404).json({
                status: "failed",
                msg: "User not found"
            });
        }
        res.status(200).json({
            status: "successful",
            user: val[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'failed',
            msg: `Error retrieving user: ${err.message}`
        });
    }
});


// --- Create (POST) Operation ---

app.post("/api/users", async (req, res) => {
    // Expected body fields: first_name, last_name, email, job_title, salary
    const { first_name, last_name, email, job_title, salary } = req.body;

    if (!first_name || !email || !salary) {
        return res.status(400).json({ status: "failed", msg: "Missing required fields (first_name, email, salary)" });
    }

    try {
        const query = `INSERT INTO users (first_name, last_name, email, job_title, salary) VALUES (?, ?, ?, ?, ?)`;
        
        // Passing values as an array is crucial for security (Parameterized Query)
        const [result] = await pool.query(query, [
            first_name, 
            last_name || null, // Optional last_name
            email, 
            job_title || null, // Optional job_title
            salary
        ]);

        res.status(201).json({
            status: "successful",
            msg: "User created successfully",
            userId: result.insertId // Return the ID of the newly created user
        });
        
    } catch (err) {
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


// --- Update (PATCH) Operation ---

app.patch("/api/users/:id", async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: "failed", msg: "No fields provided for update." });
    }

    try {
        // Build query dynamically based on fields present in the request body
        let setClauses = [];
        let values = [];
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                // Ensure key names match your database columns
                setClauses.push(`${key} = ?`);
                values.push(updates[key]);
            }
        }

        // Add the user ID to the values array for the WHERE clause
        values.push(userId);

        const query = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
        
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "failed", msg: "User not found or no changes made." });
        }

        res.status(200).json({
            status: "successful",
            msg: `User ID ${userId} updated successfully.`,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'failed',
            msg: `Database error during user update: ${err.message}`
        });
    }
});


// --- Delete (DELETE) Operation ---

app.delete("/api/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        // Parameterized query for safe deletion
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "failed", msg: "User not found." });
        }

        res.status(200).json({
            status: "successful",
            msg: `User ID ${userId} deleted successfully.`,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'failed',
            msg: `Database error during user deletion: ${err.message}`
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}....`);
});