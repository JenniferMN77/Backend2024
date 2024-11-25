const { Router } = require('express');
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/products');

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
