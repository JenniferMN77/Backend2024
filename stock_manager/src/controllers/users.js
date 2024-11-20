const {request, response} = require('express');
const bcrypt = require('bcrypt')
const pool = require('../db/connection');
const { usersQueries } = require('../models/users');

const saltRounds = 10;
//const users = [
//    {id: 1, name: 'Ana martinez'},
//    {id: 2, name: 'Gabriel garcia'},
//    {id: 3, name: 'Bob jackson'},
//];

const getAllUsers = async (req, res)=> { //el objetivo de este endpoint obtener todos los registros de usuarios 
   let conn;
    try{
        conn = await pool.getConnection();
        const users = await conn.query(usersQueries.getAll);

        res.send(users);
   } catch (error) {
    res.status(500).send(error);
    return;
   } finally {

    if(conn) conn.end();
   }

};

const getUserById = async (req, res) => {//otro endpoint para obtener usuario por id
 const {id} = req.params;

 if (isNaN(id)) { 
    res.status(400).send('Invalid ID');
    return;
 }

let conn;
 try{
    conn = await pool.getConnection();
    const user = await conn.query(usersQueries.getById, [+id]);

    if(users.length === 0){
        res.status(400).send('User not found');
        return;
     }

     res.send(user);
 }catch(error){
    res.status(500).send(error);
 }finally{
    if(conn) conn.end();
 }

 //const user = users.find(user => user.id === +id);

}    

//inicio del endpoint para agregar un nuevo usuario
const createUser = async (req, res) => {
    const{username, password, email} = req.body;

    if(!username|| !password|| !email){
        res.status(400).send('Bad request. Some field are missing');
        return;
    } 
let conn;
 try{
    conn = await pool.getConnection();
    const user = await conn.query(usersQueries.getByUsername, [username]);
    if(user.length >0){
        res.status(409).send('User name already exits');
        return;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await conn.query(usersQueries.create, [username, hashPassword, email]);
    if(newUser.affectedRows === 0){
       res.status(500).send("User could not be created"); 
       return;
    }
    res.status(201).send("User created succesfully");
 }catch(error){
    res.status(500).send(error);
 }finally{
    if(conn) conn.end();
 }
};

const loginUser = async (req = request, res = response) => {
   const { username, password } = req.body;
   if (!username || !password) {
     res.status(400).send('Username and password are mandatory!');
     return;
   }
 
   let conn;
   try {
     conn = await pool.getConnection();
     const user = await conn.query(usersQueries.getByUsername, [username]);
 
     if (user.length === 0) {
       res.status(404).send('Bad username or password');
       return;
     }
 
     const passwordMatch = await bcrypt.compare(password, user[0].password); // Cambié bcript a bcrypt
     if (!passwordMatch) {
       res.status(403).send('Bad username or password');
       return;
     }
 
     res.send('Logged in!');
   } catch (error) {
     console.error(error); // Agregado para depuración
     res.status(500).send(error);
   } finally {
     if (conn) conn.end();
   }
 };
 







//editar usuaro o actualizar usuario
const updateUser = async (req = request, res = response) => {
    const { id } = req.params; // obtener el ID del usuario desde los parámetros de la solicitud
    const { username, password, email } = req.body; // obtener los nuevos datos desde el cuerpo de la solicitud
  
    // Validación de los campos y los tipo de dato de cads ID
    if (isNaN(id)) {
      res.status(400).send('Invalid ID');
      return;
    }
    if (!username || !password || !email) {
      res.status(400).send('Username, password, and email are required');
      return;
    }
  
    let conn;
    try {
      conn = await pool.getConnection();
      const user = await conn.query(usersQueries.getById, [+id]);
  
      if (user.length === 0) {
        res.status(404).send('User not found');
        return;
      }
  
      // Ejecutar la consulta de actualización
      const updatedUser = await conn.query(usersQueries.update, [username, password, email, +id]);
  
      if (updatedUser.affectedRows === 0) {
        res.status(500).send('User could not be updated');
        return;
      }
  
      res.send('User updated successfully');
    } catch (error) {
      res.status(500).send(error);
    } finally {
      if (conn) conn.end();
    }
  };

// para actualizar la contraseña de un usuario
const updatePassword = async (req = request, res = response) => {
   const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud
   const { newPassword } = req.body; // Obtener la nueva contraseña desde el cuerpo de la solicitud
 
   // Validar los datos de entrada
   if (isNaN(id)) {
     res.status(400).send('Invalid ID');
     return;
   }
 
   if (!newPassword) {
     res.status(400).send('New password is required');
     return;
   }
 
   let conn;
   try {
     conn = await pool.getConnection();
     const user = await conn.query(usersQueries.getById, [+id]);
 
     if (user.length === 0) {
       res.status(404).send('User not found');
       return;
     }
 
     // Hashear la nueva contraseña
     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
 
     // Actualizar la contraseña
     const result = await conn.query(usersQueries.updatePassword, [hashedPassword, +id]);
 
     if (result.affectedRows === 0) {
       res.status(500).send('Password could not be updated');
       return;
     }
 
     res.send('Password updated successfully');
   } catch (error) {
     res.status(500).send(error.message);
   } finally {
     if (conn) conn.end();
   }
 };
 

//eliminar usuarios

const deleteUser = async (req, res) => {
    const {id} = req.params;

    if(isNaN(id)) {
        res.status(400).send('Invalid Id');
        return;
    }
    let conn;
    try{
       conn = await pool.getConnection();
       const user = await conn.query(usersQueries.getUserById, [+id]);
       if(user.length === 0){
           res.status(404).send('User not found');
           return;
       }
       const deleteUser = await conn.query(usersQueries.delete, [+id]);

       if(deleteUser.affectedRows === 0){
          res.status(500).send("User could not be deleted"); 
          return;
       }
       res.send("User deleted succesfully");
    }catch(error){
       res.status(500).send(error);
       return;
    }finally{
       if(conn) conn.end();
    } 

}

module.exports = {getAllUsers, getUserById, createUser, loginUser, updatePassword, updateUser, deleteUser};

