const http = require("http");
const fs = require("fs"); // File System module

const myServer = http.createServer((req, res) => {
    // 1. লগ ডেটা তৈরি করা হলো
    const log = `${new Date().toLocaleString()} : ${req.url}\n`; // '\n' যোগ করা হলো নতুন লাইনের জন্য
    console.log(`New request received : ${log}`);

    // 2. ডেটা log.txt ফাইলে লেখা হলো (asynchronously)
    
    fs.appendFile("log.txt", log, (err, data) => {
        if (err) {
            console.error("Error writing to log file:", err);
            // যদি ফাইল লিখতে সমস্যা হয়, তবুও ইউজারকে রেসপন্স পাঠানো জরুরি
            res.statusCode = 500;
            res.end("Server Error");
            return;
        }

        // 3. switch case এর মাধ্যমে URL অনুযায়ী রেসপন্স পাঠানো হলো
        switch (req.url) {
            case "/":
                // এখানে শুধু একবারই res.end() ব্যবহার করা হয়েছে
                res.end( "Welcome to the Home Page!"); 
                break;
            case "/about":
                res.end("I am Roby, your technical friend.");
                break;
            default:
                // 404 রেসপন্স
                res.statusCode = 404; // HTTP 404 স্ট্যাটাস কোড সেট করা হলো
                res.end("404 : Not Found");
        }
    });

});

myServer.listen(8000, () => console.log(`Server started on http://localhost:8000`));