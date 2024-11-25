const { request, response } = require('express');
const pool = require('../db/connection');
const { supplierQueries } = require('../models/suppliers');

// Obtener todos los proveedores
const getAllSuppliers = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const suppliers = await conn.query(supplierQueries.getAll);
        res.json(suppliers);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Obtener proveedor por RFC
const getSupplierByRFC = async (req = request, res = response) => {
    const { rfc } = req.params;

    if (!rfc || rfc.trim() === '') {
        res.status(400).send('RFC is required');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();

        const [supplier] = await conn.query(supplierQueries.getByRFC, [rfc]);

        if (!supplier || supplier.length === 0) {
            res.status(404).send('Supplier not found');
            return;
        }

        res.status(200).send(supplier);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Crear un nuevo proveedor
const createSupplier = async (req = request, res = response) => {
    const { rfc, name, description, phone_number, email, address } = req.body;
    if (!rfc || !name || !description || !phone_number || !email || !address) {
        res.status(400).send('All fields are required');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(supplierQueries.create, [rfc, name, description, phone_number, email, address]);
        if (result.affectedRows === 0) {
            res.status(500).send('Supplier could not be created');
            return;
        }
        res.status(201).send('Supplier created successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Actualizar un proveedor
const updateSupplier = async (req = request, res = response) => {
    const { rfc } = req.params;
    const { name, description, phone_number, email, address } = req.body;

    // Validar si el RFC está presente y no es una cadena vacía
    if (!rfc || rfc.trim() === '') {
        res.status(400).send('RFC is required');
        return;
    }

    if (!name || !description || !phone_number || !email || !address) {
        res.status(400).send('All fields are required');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();

        const [supplier] = await conn.query(supplierQueries.getByRFC, [rfc]);

        if (!supplier || supplier.length === 0) {
            res.status(404).send('Supplier not found');
            return;
        }

        const result = await conn.query(supplierQueries.update, [name, description, phone_number, email, address, rfc]);

        if (result.affectedRows === 0) {
            res.status(500).send('Supplier could not be updated');
            return;
        }

        res.status(200).send('Supplier updated successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Eliminar un proveedor
const deleteSupplier = async (req = request, res = response) => {
    const { rfc } = req.params;

    // Validar si el RFC está presente y no es una cadena vacía
    if (!rfc || rfc.trim() === '') {
        res.status(400).send('RFC is required');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();

        const [supplier] = await conn.query(supplierQueries.getByRFC, [rfc]);

        if (!supplier || supplier.length === 0) {
            res.status(404).send('Supplier not found');
            return;
        }
        const result = await conn.query(supplierQueries.delete, [rfc]);

        if (result.affectedRows === 0) {
            res.status(500).send('Supplier could not be deleted');
            return;
        }
        res.status(200).send('Supplier deleted successfully');
    } catch (error) {
        console.error(error); 
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

module.exports = { getAllSuppliers, getSupplierByRFC, createSupplier, updateSupplier, deleteSupplier };