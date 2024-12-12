const {request, response} = require ('express');
const pool = require('../db/connection');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const usersQueries = require('../models/users');
require('dotenv').config();

const secret = process.env.SECRET;

const login = async (req = request, res = response) => {
    const {email, password} = req.body;

    if (!email || !password){
        res.status(400).send({
            message: 'Some fields are missing'
        })
    }

    let conn;
    try{
        conn = await pool.getConnection();

        const [user] = await conn.query(usersQueries.getByEmail, [email]);
        if(!user){
            res.status(404).send({ message: 'User not found'});
            return;
        }
       
        const valid = await bcrypt.compare(password, user.password);
        if(!valid){
            res.status(401).send({message: 'invalid credentials'});
            return;
        }

        const token = jwt.sign({
            id: user.id,
            is_admin: user.is_admin

        }, secret, {
            expiresIn: "5m"
        });

        delete user.password;
        res.status(200).send({
            message: ' succesfully loggen in',
            user,
            token
        });


    }catch (err) {
        res.status(500).send(err);
        return;
    }finally{
        if(conn) conn.end();
    }
};

module.exports = {login};
