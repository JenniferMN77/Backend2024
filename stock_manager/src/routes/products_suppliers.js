const express = require('express');
const {
  getAllProductsSuppliers,
  getProductsSupplierById,
  createProductsSupplier,
  updateProductsSupplier,
  deleteProductsSupplier,
} = require('../controllers/products_suppliers');

const router = express.Router();

// Rutas para los proveedores de productos
router.get('/', getAllProductsSuppliers);  // Obtener todos los proveedores
router.get('/:id', getProductsSupplierById);  // Obtener proveedor por ID
router.post('/', createProductsSupplier);  // Crear nuevo proveedor
router.put('/:id', updateProductsSupplier);  // Actualizar proveedor
router.delete('/:id', deleteProductsSupplier);  // Eliminar proveedor

module.exports = router;
