const express = require('express');

const app = express();
const usuarios=[
    {
    id: 1,
    nombre: "Jennifer",
    apellido: "perez",
    email: "jennifer@gmail.com",
    },
    {
        id: 2,
        nombre: "Ana",
        apellido: "perez",
        email: "ana@gmail.com",    
    },
];

app.get("/usuarios",(req, res) => {
    res.status(200).send({usuarios});
});

app.get("/usuarios/:id", (req,res)=>{
    const {id} = req.params;

  const usuario = usuarios.find((usuario) => usuario.id == id);

    res.status(200).send(usuario);
} );

app.listen(3000,()=> {

    console.log("Servidor corriendo en http://localhost:3000");

});
