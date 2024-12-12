const {request, response} = require('express');
const userQueries = require('../models/users');
const pool = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET;

const SALT_ROUNDS = 10;

const userProtected = async (req = request, res = response) =>{
    console.log({req});
    res.send({ message: "You have access!"});
}

const getAllUsers = async (req = request, res= response) =>{
    let conn;

    try{
        conn= await pool.getConnection();
        const users = await conn.query(userQueries.getAll);

        res.json(users);
        return;

    } catch (err){
        console.error('Error in getAllUsers:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;

    } finally{
        if (conn) conn.end();

    }
    
};

const createUser = async (req=request, res= response) => {
    const { 
        first_name,
        last_name,
        email,
        password
    }=req.body;

    const {id, is_admin} = req;
    console.log({id, is_admin});

    if ( !id || !is_admin === undefined) {
        res.status(400).send({ message: 'missing required fields'});
        return;
    }

    if(is_admin !== 1){
        res.status(403).send({ message: ' you do not have enough privileges '});
        return;
    }

    if(!first_name || !last_name || !email || !password){
        res.status(400).json({message: 'Missing required fields'});
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const [user_exists] = await conn.query(userQueries.getByEmail, [email]);
        
        if (user_exists) {
            res.status(409).send({ message: 'User already exists' });
            return;
        }
        

        //si todo esta en orden ya se puede insertar 
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await conn.query(userQueries.addUser, [first_name, last_name, email, hashedPassword]);

        if (newUser.affectedRows === 0) {
            res.status(500).send({ message: 'Error adding user' });
            return;
        }
         
        
        res.status(201).send({message: 'User created'});

    }catch (err){
        res.status(500).json(err);
        return;

    }finally{
        if (conn) conn.end();
    }

};

const getUser = async (req = request, res = response) =>{
   const {id} = req.params;

   if(isNaN(id)){
    res.status(400).send('Invalid ID');
    return;
   }

   let conn;
   try{
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getById, [id]);

    if (user.length === 0) {
        res.status(404).send({ message: 'User not found' });
        return;
    }
    
    res.json(user[0]); // Devuelve el usuario encontrado
    

   }catch (err){
    res.status(500).json(err);
    return;
   }finally{
    if (conn) conn.end();
   }
};

const updateUser = async (req = request, res = response) => {
    const {id} = req.params;
    const{
        first_name,
        last_name,
        email
    } = req.body;

    if(isNaN(id)){
        res.status(400).send({message: 'Invalid user ID'});
        return;
       }
    
    if(!first_name || !last_name || !email){
        res.status(400).json({message: 'Missing required fields'});
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const [user]= await conn.query(userQueries.getById, [id]);
        if(!user){
            res.status(404).send({message: 'user not found'});
            return;
        }
        const [emailExist]= await conn.query(userQueries.emailValid, [email, id]);
            if(emailExist){
                res.status(409).send({message: 'Email already in use'});
                return;
            }


        const updateUser = await conn.query(userQueries.editUser, [first_name, last_name, email, id]);
        if(updateUser.affectedRows === 0){
            res.status(500).send({message: 'user not updated'});
            return;
        }
        res.send({message: 'user updated'});
    }catch (err){
        res.status(500).json(err);
        return;
    }finally{
        if (conn) conn.end();
    }
};

 const destroyUser = async (req = request, res = response) => {
        const {id} = req.params;
       
        if(isNaN(id)){
            res.status(400).send({message: 'Invalid user ID'});
            return;
           }
    
    let conn;
    try {
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getById, [id]);

        if (!user) {
            res.status(404).send({message: 'user not found'});
            return;
        }
        const deleteUser = await conn.query(userQueries.deleteUser, [id]);
        if(deleteUser.affectedRows === 0){
            res.status(500).send({message: 'error deleting user'});
            return;
        }
        res.send({message: 'user deleted'});
    }catch (err){
        res.status(500).json(err);
        return;
    }finally{
        if (conn) conn.end();
    }
    };

module.exports = {getAllUsers, createUser, getUser, updateUser, destroyUser, userProtected};