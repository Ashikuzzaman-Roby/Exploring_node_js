const http = require("http");
const fs = require("fs");
const url = require("url");


my_server=http.createServer((req, res)=>{
    const log = `${new Date().toLocaleString()} : ${req.url}\n`
    console.log(`Got a request on ${log}`);
    const myUrl= url.parse(req.url,true);
    console.log(myUrl);

    fs.appendFile("log_2.txt", log, (err, data)=>{
        if(err){
            res.statusCode=500
            console.log(`An error occured`)
            return res.end(`${res.statusCode} error . sever can't reach to the file `)
        }

        switch(myUrl.pathname){
            case "/":
                res.end(`welcome to the home page`);
                break
            case "/about":
                res.end("Hey there, This is Roby from bangladesh");
                break
            
            case "/log":
                fs.readFile("log_2.txt","utf-8" ,(err, data)=>{
                    if(err){
                        res.statusCode = 500;
                        console.error("An error occured");
                        return res.end(`${res.statusCode} : couldnot read the file`)
                    }
                   
                    else{
                        res.end(`${data}`);
                    }
                });
                break
            case "/search":
                const search = myUrl.query.search_query;
                res.end(`Here is your result for ${search}`)


                   
            default:
                res.statusCode= 404
                res.end(`${res.statusCode} : not fount`);
                break

        }
    })

    
});

my_server.listen(8000,()=>{
    console.log(`Server is listening`)
})