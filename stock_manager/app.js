const express = require('express');

 const app = express();

 app.use(express.json());

 app.get('/',(req, res)=>{
    res.send("Hello word");
 });

 app.listen(3000, ()=>{
    console.log("Example app listenig on port 3000");
 });
