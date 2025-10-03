const http = require("http");
const fs = require("fs");
const url = require("url");

const myServer = http.createServer((req, res)=>{
    const myUrl = url.parse(req.url,true);
    const path_name = myUrl.pathname ;
    const query = myUrl.query;
    const log = ` ${new Date().toLocaleString()} : ${path_name}\n` ;
    console.log(log);
    console.log(myUrl);
    fs.appendFile("log_03.txt",log, (err,data)=>{
        if(err){
             res.statusCode=500;
             console.log(`An error happening here`);
             return res.end(`file cannot read`);
        }

        switch(path_name){
            case "/":
                res.end(`Hello from Home page`);
                break
            case "/about":
                res.end("Hey there !! THis is Roby from bangladesh");
                break
            case "/user":
                const user_id = query.id;
                const user_city= query.city;
                if(user_id){
                    res.statusCode = 200;
                    return res.end(`Hey  ${user_id} , just found your ${user_city}`);

                }
                else{
                    res.statusCode = 400;
                    return res.end(`an invalid request`);
                }

                


        }

    })


});

myServer.listen(8000,()=>{console.log("Server is running ")});