const express = require('express');

const app = express();

app.get("/usuarios",(req, res) => {
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

    res.status(200).send(usuarios);
});

app.listen(3000,()=> {

    console.log("Servidor corriendo en http://localhost:3000");

});
