const suppliersQueries = {
    getAllSuppliers: 'SELECT * FROM products_suppliers', // Nombre de la tabla: products_suppliers
    getById: 'SELECT * FROM products_suppliers WHERE id = ?', // Nombre de la tabla: products_suppliers
    create: 'INSERT INTO products_suppliers (product_id, supplier_rfc, notes) VALUES (?, ?, ?)', // Nombre de la tabla: products_suppliers
    update: 'UPDATE products_suppliers SET product_id = ?, supplier_rfc = ?, notes = ? WHERE id = ?', // Nombre de la tabla: products_suppliers
    delete: 'DELETE FROM products_suppliers WHERE id = ?', // Nombre de la tabla: products_suppliers
};

module.exports = { suppliersQueries };
