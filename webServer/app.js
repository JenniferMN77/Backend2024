const {createServer} = require("http");

const server = createServer((req, res)=>{
    console.log(req);
    res.write("Hola mundo ");
    res.end();
});

server.listen(8090);
console.log("servidor web ");