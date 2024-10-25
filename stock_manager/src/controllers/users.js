const {request, response} = require('express');

const users = [
    {id: 1, name: 'Ana martinez'},
    {id: 2, name: 'Gabriel garcia'},
    {id: 3, name: 'Bob jackson'},
];

const getAll = (req, res)=> { //el objetivo de este endpoint obtener todos los registros de usuarios 
    res.send(users);
} 

const getById = (req, res) => {//otro endpoint
 const {id} = req.params;

 if (isNaN(id)) { 
    res.status(400).send('Invalid ID');
    return;
 }

 const user = users.find(user => user.id === +id);

 if(!users){
    res.status(400).send('User not found');
    return
 }

 res.send(user);
}    

module.exports = {getAll, getById};