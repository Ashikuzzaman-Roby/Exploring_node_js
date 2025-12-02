// server.js ফাইল

const express = require('express');
const mysql = require('mysql2'); // MariaDB সংযোগের জন্য
const app = express();
const PORT = 3000;

// ডেটাবেস সংযোগের কনফিগারেশন
const db_config = {
    host: 'localhost', 
    user: 'root',
    password: '', // <--- এটি পরিবর্তন করুন
    database: 'node_db_example'       // <--- এটি পরিবর্তন করুন (বা আপনার তৈরি করা DB নাম দিন)
};

// কানেকশন পুল তৈরি (এটি সংযোগকে দক্ষতার সাথে পরিচালনা করে)
const pool = mysql.createPool(db_config).promise();

// সার্ভার সংযোগ পরীক্ষা
pool.query('SELECT 1')
    .then(() => {
        console.log('✅ MariaDB Connected Successfully!');
    })
    .catch((err) => {
        console.error('❌ Error connecting to MariaDB: Check your credentials!', err.message);
        // যদি ডাটাবেস সংযোগ না হয়, সার্ভার বন্ধ করে দেবে
        process.exit(1); 
    });


// --- ১. হোম রুট (Home Route) ---
app.get('/', (req, res) => {
    
    res.send('<h1>Node.js and MariaDB API is Running!</h1><p>Try accessing: /api/users or /api/users/1</p>');
});


// --- ২. সমস্ত ইউজারকে দেখানোর রুট (/api/users) ---
app.get('/api/users', async (req, res) => {
    try {
        // ডেটাবেস থেকে সমস্ত ইউজারদের ডেটা নিয়ে আসা
        const [rows] = await pool.query('SELECT id, name, designation FROM users');
        
        res.status(200).json({
            status: 'success',
            users: rows
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: 'Failed to retrieve user list' });
    }
});


// --- ৩. একটি নির্দিষ্ট ইউজারকে দেখানোর রুট (/api/users/:id) ---
// Note: এখানে `:id` হলো একটি "রুট প্যারামিটার"
app.get('/api/users/:id', async (req, res) => {
    // রুট প্যারামিটার থেকে ID নেয়া
    const userId = req.params.id; 

    try {
        // ডেটাবেস থেকে নির্দিষ্ট ID এর ইউজারকে নিয়ে আসা
        // `?` ব্যবহার করা হয়েছে SQL Injection থেকে বাঁচার জন্য (ওয়েব সিকিউরিটি!)
        const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: `User with ID ${userId} not found` });
        }
        
        res.status(200).json({
            status: 'success',
            user: rows[0]
        });
    } catch (error) {
        console.error("Error fetching single user:", error);
        res.status(500).json({ error: 'Failed to retrieve user data' });
    }
});


// সার্ভার চালু করুন
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});