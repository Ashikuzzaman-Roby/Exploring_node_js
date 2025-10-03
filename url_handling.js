
// Way 01 : 

// const http = require("http");
// const fs = require("fs");
// const url = require("url");


// my_server=http.createServer((req, res)=>{
//     const log = `${new Date().toLocaleString()} : ${req.url}\n`
//     console.log(`Got a request on ${log}`);
//     const myUrl= url.parse(req.url,true);
//     console.log(myUrl);

//     fs.appendFile("log_2.txt", log, (err, data)=>{
//         if(err){
//             res.statusCode=500
//             console.log(`An error occured`)
//             return res.end(`${res.statusCode} error . sever can't reach to the file `)
//         }

//         switch(myUrl.pathname){
//             case "/":
//                 res.end(`welcome to the home page`);
//                 break
//             case "/about":
//                 res.end("Hey there, This is Roby from bangladesh");
//                 break
            
//             case "/log":
//                 fs.readFile("log_2.txt","utf-8" ,(err, data)=>{
//                     if(err){
//                         res.statusCode = 500;
//                         console.error("An error occured");
//                         return res.end(`${res.statusCode} : couldnot read the file`)
//                     }
                   
//                     else{
//                         res.end(`${data}`);
//                     }
//                 });
//                 break
//             case "/search":
//                 const search = myUrl.query.search_query;
//                 res.end(`Here is your result for ${search}`)


                   
//             default:
//                 res.statusCode= 404
//                 res.end(`${res.statusCode} : not fount`);
//                 break

//         }
//     })

    
// });

// my_server.listen(8000,()=>{
//     console.log(`Server is listening`)
// })





// understanding url handling : 

const http = require("http");
const fs = require("fs");
// 🌟 ১. URL মডিউল ইম্পোর্ট করা জরুরি 🌟
const url = require("url"); 


const my_server = http.createServer((req, res) => {
    
    // 🌟 ২. req.url কে পার্স করে অবজেক্টে রূপান্তর করা 🌟
    // true প্যারামিটারটি নিশ্চিত করে যে Query গুলো একটি অবজেক্ট হিসেবে আসবে।
    const myUrl = url.parse(req.url, true); 
    
    // রুট নেম: যেমন '/', '/about', '/user'
    const pathName = myUrl.pathname; 
    
    // Query প্যারামিটার অবজেক্ট: যেমন { id: '101', city: 'dhaka' }
    const query = myUrl.query; 

    // লগ ডেটা তৈরি
    const log = `${new Date().toLocaleString()} : ${req.method} : ${pathName} : ${JSON.stringify(query)}\n`;
    console.log(`Got a request on ${log}`);

    // লগ ফাইলে ডেটা যোগ করা হচ্ছে
    fs.appendFile("log_manual_url.txt", log, (err) => {
        if (err) {
            res.statusCode = 500;
            console.error(`Error during log append:`, err);
            return res.end(`${res.statusCode} error. ফাইল রাইটে সমস্যা।`);
        }

        // রুট নেম অনুযায়ী সুইচ করা হচ্ছে
        switch (pathName) {
            case "/":
                res.end(`Welcome to the Home Page`);
                break;

            case "/about":
                res.end("This is the About Page.");
                break;

            // 🌟 ৩. Query প্যারামিটার ব্যবহার করা 🌟
            case "/user":
                // query.id দিয়ে সরাসরি URL এর "?" এর পরের ডেটা পাওয়া যাচ্ছে
                const userId = query.id; 
                const userCity = query.city || 'Not Specified';

                if (userId) {
                    res.statusCode = 200;
                    return res.end(`User ID: ${userId} found! City: ${userCity}`);
                } else {
                    res.statusCode = 400; // Bad Request
                    return res.end("Please provide a user ID in the URL (e.g., /user?id=101)");
                }
                break;

            case "/log":
                // লগ ফাইল পড়ে ডেটা ক্লায়েন্টকে পাঠানো
                fs.readFile("log_manual_url.txt", "utf-8", (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        console.error("Error reading log file:", err);
                        return res.end(`${res.statusCode} : লগ ফাইল পড়া সম্ভব হয়নি।`);
                    }
                    res.end(`--- Server Logs ---\n${data}`);
                });
                break;

            default:
                // 404 Not Found
                res.statusCode = 404;
                res.end(`404 : রুটটি খুঁজে পাওয়া যায়নি: ${pathName}`);
                break;
        }
    });
});

my_server.listen(8000, () => {
    console.log(`Server is listening on http://localhost:8000`);
    console.log(`Test URL 1: http://localhost:8000/user?id=250&city=sylhet`);
    console.log(`Test URL 2: http://localhost:8000/products/details`); // 404 হবে
});
