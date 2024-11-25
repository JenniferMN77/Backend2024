const { request, response } = require('express');
const pool = require('../db/connection');
const { suppliersQueries } = require('../models/products_suppliers');

// Obtener todos los proveedores de productos
const getAllProductsSuppliers = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const suppliers = await conn.query(suppliersQueries.getAllSuppliers); // Verifica que la consulta esté apuntando a 'product_suppliers'

        res.send(suppliers);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Obtener un proveedor de producto por ID
const getProductsSupplierById = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const supplier = await conn.query(suppliersQueries.getById, [+id]);

        if (supplier.length === 0) {
            res.status(404).send('Supplier not found');
            return;
        }

        res.send(supplier);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Crear un nuevo proveedor de producto
const createProductsSupplier = async (req = request, res = response) => {
    const { product_id, supplier_rfc, notes } = req.body;

    if (!product_id || !supplier_rfc) {
        res.status(400).send('Bad Request. Fields "product_id" and "suppliers_rfc" are required');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const newSupplier = await conn.query(suppliersQueries.create, [
            product_id,
            supplier_rfc,
            notes || null, // Si no se proporciona `notes`, se guarda como NULL.
        ]);

        if (newSupplier.affectedRows === 0) {
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

// Actualizar un proveedor de producto
const updateProductsSupplier = async (req = request, res = response) => {
    const { id } = req.params;
    const { product_id, supplier_rfc, notes } = req.body;

    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    if (!product_id && !supplier_rfc && !notes) {
        res.status(400).send('At least one field is required to update');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const updatedSupplier = await conn.query(suppliersQueries.update, [
            product_id || null,
            supplier_rfc || null,
            notes || null,
            +id,
        ]);

        if (updatedSupplier.affectedRows === 0) {
            res.status(404).send('Supplier not found or no changes made');
            return;
        }

        res.status(200).send('Supplier updated successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Eliminar un proveedor de producto
const deleteProductsSupplier = async (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const deletedSupplier = await conn.query(suppliersQueries.delete, [+id]);

        if (deletedSupplier.affectedRows === 0) {
            res.status(404).send('Supplier not found or could not be deleted');
            return;
        }

        res.status(200).send('Supplier deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

module.exports = {
    getAllProductsSuppliers,
    getProductsSupplierById,
    createProductsSupplier,
    updateProductsSupplier,
    deleteProductsSupplier,
};
