const {Router} = require('express');
const {getAllUsers, getUserById, createUser, updateUser, deleteUser} = require('../controllers/users');

const router = Router();

router.get('/',  getAllUsers);
//ruta para obtener usuario
router.get('/:id',  getUserById); 

//para nuevo usuario 
router.post('/',createUser);

//para editar usuario existente
router.put('/:id',updateUser);

//ruta para eliminar usuario
router.delete('/:id', deleteUser);

module.exports = router;