const express = require("express");
const app = express();
const PORT = 8000;


users=require("./MOCK_DATA.json");


app.get("/api/users" , (req, res)=>{
    return res.json(users);
})

app.get("/users", (req, res)=>{
    
    // 💡 ভুল সংশোধন: .join("") মেথডটি map() ফাংশনের বাইরে থাকতে হবে।
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User List</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; }
            ul {  padding: 0; }
            li { background: #fff; margin-bottom: 8px; padding: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>ইউজারদের তালিকা</h1>
        <ul>
            ${
                // 🌟 এখানে দেখুন: map() এর পরে .join("") ব্যবহার করা হয়েছে।
                users.map((user)=>`<li>${user.first_name}</li>`).join("")
            }
        </ul>
    </body>
    </html>
    `;
    
    // HTML ডেটা ক্লায়েন্টকে পাঠানো হচ্ছে
    res.send(html);
})




app.listen(PORT, ()=>{
    console.log(`The server is listening .. `)
})