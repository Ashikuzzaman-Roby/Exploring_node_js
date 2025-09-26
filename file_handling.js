const { isUtf8 } = require("buffer");
const fs= require("fs")
fs.writeFile("./text.txt", `Hellow world without sync`,(err)=>{

} );

fs.writeFileSync("./test.txt","Writting file with sync")

// Reading the file 

res= fs.readFileSync("./test.txt","utf-8")
console.log(res);


// without sync : 

fs.readFile("./text.txt","utf-8", (err,result)=>{
    if(err){
        console.log("Error : ", err);

    }
    else{
        console.log(result);
    }
})


// Appending something in the files. 
// fs.appendFile("./text.txt", new Date().getDate().toLocaleString());
fs.appendFileSync("./test.txt", "Hey there this is Roby\n");