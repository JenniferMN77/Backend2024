const{request, response} = require ('express');
const pool = require ('../db/connection');
const {staffQueries} = require ('../models/staff');

//obtener  todos los registros de staff

    const getAllStaff = async (req = request, res = response) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const staff = await conn.query(staffQueries.getAll);
            res.send(staff);
        } catch (error) {
            res.status(500).send(error);
        } finally {
            if (conn) conn.end();
        }
    };

    // Obtener un registro de staff por ID
const getStaffById = async (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [staff] = await conn.query(staffQueries.getById, [+id]);

        if (staff.length === 0) {
            res.status(404).send('Staff not found');
            return;
        }

        res.send(staff);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Crear un nuevo registro de staff
const createStaff = async (req = request, res = response) => {
    const { first_name, last_name, birth_date, gender, phone_number, email, address, user_id } = req.body;

    if (!first_name || !last_name || !birth_date ||!gender || !phone_number || !email|| !address || !user_id) {
        res.status(400).send('Bad request. Some fields are missing');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(staffQueries.create, [first_name, last_name, birth_date, gender, phone_number,email, address, user_id]);

        if (result.affectedRows === 0) {
            res.status(500).send('Staff could not be created');
            return;
        }

        res.status(201).send('Staff created successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Actualizar un registro de staff
const updateStaff = async (req = request, res = response) => {
    const { id } = req.params;
    const { first_name, last_name, birth_date, gender, phone_number, email, address, user_id } = req.body;

    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }
    if (!first_name || !last_name || !birth_date|| !gender ||!phone_number ||!email ||!address ||!user_id) {
        res.status(400).send('All fielda are required');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [staff] = await conn.query(staffQueries.getById, [+id]);

        if (staff.length === 0) {
            res.status(404).send('Staff not found');
            return;
        }

        const result = await conn.query(staffQueries.update, [first_name, last_name, birth_date, gender, phone_number, email, address, user_id, +id]);

        if (result.affectedRows === 0) {
            res.status(500).send('Staff could not be updated');
            return;
        }

        res.send('Staff updated successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Eliminar un registro de staff
const deleteStaff = async (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [staff] = await conn.query(staffQueries.getById, [+id]);

        if (staff.length === 0) {
            res.status(404).send('Staff not found');
            return;
        }

        const result = await conn.query(staffQueries.delete, [+id]);

        if (result.affectedRows === 0) {
            res.status(500).send('Staff could not be deleted');
            return;
        }

        res.send('Staff deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};


module.exports = {getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff};