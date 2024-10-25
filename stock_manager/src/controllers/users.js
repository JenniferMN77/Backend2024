const {request, response} = require('express');

const getMessage = (req, res)=> {
    res.send('Hello from the user controller!!!');
} 

module.exports = {getMessage};