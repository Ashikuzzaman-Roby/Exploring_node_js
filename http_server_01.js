const http = require("http");
const fs = require("fs");


my_server=http.createServer((req, res)=>{
    const log = `${new Date().toLocaleString()} : ${req.url}\n`
    console.log(`Got a request on ${log}`)

    fs.appendFile("log_1.txt", log, (err, data)=>{
        if(err){
            res.statusCode=500
            console.log(`An error occured`)
            return res.end(`${res.statusCode} error . sever can't reach to the file `)
        }
// fquestion is why I am using here a return statement and a status code. and why I am sending a response to the client . 
// first of all is it is a good practice that a clint is not waitign till the timeout 
// by giving a response to the user you ensure a professionalism and by using return statement
//  you ensure that multiple reply should not given.
// for error handiling it is said that 7using statusCode  is a good practice. 

// remember default is only used for 404 not found only. 


        switch(req.url){
            case "/":
                res.end(`welcome to the home page`);
                break
            case "/about":
                res.end("Hey there, This is Roby from bangladesh");
                break
            
            case "/log":
                // res.end(`404 : not fount`);
                fs.readFile("log_1.txt","utf-8" ,(err, data)=>{
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