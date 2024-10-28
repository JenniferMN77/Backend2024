const {Router} = require('express');
const {getAll, getById, addUser, updateUser, deleteUser} = require('../controllers/users');

const router = Router();

router.get('/',  getAll);
//ruta para obtener usuario
router.get('/:id',  getById); 

//para nuevo usuario 
router.post('/',addUser);

//para editar usuario existente
router.put('/:id',updateUser);

//ruta para eliminar usuario
router.delete('/:id', deleteUser);

module.exports = router;