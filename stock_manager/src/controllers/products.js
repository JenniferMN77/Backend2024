const { request, response } = require('express');
const pool = require('../db/connection');
const { productQueries } = require('../models/products');

// para pbtener todos los productos
const getAllProducts = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const products = await conn.query(productQueries.getAll);
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// paea obtener un producto por ID
const getProductById = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const product = await conn.query(productQueries.getById, [+id]);

        if (product.length === 0) {
            res.status(404).send('Product not found');
            return;
        }

        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Agregar un nuevo producto
const addProduct = async (req = request, res = response) => {
    const { product, description, stock, measurement_unit, price, discount } = req.body;

    if (!product || !description || stock === undefined || !measurement_unit || price === undefined || discount === undefined) {
        res.status(400).send('All fields are required');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const newProduct = await conn.query(productQueries.create, [product, description, stock, measurement_unit, price, discount]);

        if (newProduct.affectedRows === 0) {
            res.status(500).send('Product could not be created');
            return;
        }

        res.status(201).send("Product created successfully");
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Actualizar un producto existente
const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { product, description, stock, measurement_unit, price, discount } = req.body;

    if (isNaN(id) || !product || !description || stock === undefined || !measurement_unit || price === undefined || discount === undefined) {
        res.status(400).send('All fields and a valid ID are required');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const productExists = await conn.query(productQueries.getById, [+id]);

        if (productExists.length === 0) {
            res.status(404).send('Product not found');
            return;
        }

        const updatedProduct = await conn.query(productQueries.update, [product, description, stock, measurement_unit, price, discount, +id]);

        if (updatedProduct.affectedRows === 0) {
            res.status(500).send('Product could not be updated');
            return;
        }

        res.send('Product updated successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Eliminar un producto
const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;

    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const product = await conn.query(productQueries.getById, [+id]);

        if (product.length === 0) {
            res.status(404).send('Product not found');
            return;
        }

        const deletedProduct = await conn.query(productQueries.delete, [+id]);

        if (deletedProduct.affectedRows === 0) {
            res.status(500).send('Product could not be deleted');
            return;
        }

        res.send("Product deleted successfully");
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };
