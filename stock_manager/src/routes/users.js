const {Router} = require('express');
const {getAllUsers, getUserById, createUser, updatePassword, loginUser, updateUser, deleteUser} = require('../controllers/users');

const router = Router();

router.get('/',  getAllUsers);
//ruta para obtener usuario
router.get('/:id',  getUserById); 

//para nuevo usuario 
router.post('/',createUser);

//para innicio de sesion 
router.post('/login', loginUser); 

//para actualizar la contrseña dekl usuario
router.put('/:id/password', updatePassword);

//para editar usuario existente
router.put('/:id',updateUser);

//ruta para eliminar usuario
router.delete('/:id', deleteUser);

module.exports = router;