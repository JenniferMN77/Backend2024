const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers');

router.get('/', suppliersController.getAllSuppliers);
router.get('/:rfc', suppliersController.getSupplierByRFC);
router.post('/', suppliersController.createSupplier);
router.put('/:rfc', suppliersController.updateSupplier);
router.delete('/:rfc', suppliersController.deleteSupplier);

module.exports = router;
