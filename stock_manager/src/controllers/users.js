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

//inicio del endpoint para agregar un nuevo usuario
const addUser = (req, res) => {
    const{name} = req.body;

    if(!name){
        res.status(400).send('Name is requiered');
        return;
    } 
    const newUser = {
        id: users.length + 1, name
    }
    users.push(newUser);
    res.status(201).send(newUser);
};

//editar usuaro
const updateUser = (req, res) => {
    const{id} = req.params;
    const{name} = req.body;

    if(isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }
    const user = users.find(user => user.id === +id);

    if(!user){
        res.status(404).send('User not found');
        return;
    }
    user.name = name;
    res.send(user);

};

const deleteUser = (req, res) => {
    const {id} = req.params;

    if(isNaN(id)) {
        res.status(400).send('Invalid Id');
        return;
    }
    const user = users.find((user)=>user.id===+id);

    if(!user){
        res.status(404).send('User not found');
        return;
    }
    users.splice(user, 1);
    res.status(204).send("user deleted ");

}

module.exports = {getAll, getById, addUser, updateUser, deleteUser};

