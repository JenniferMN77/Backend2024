const express = require('express');

const app = express();
app.use(express.json());
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

    if(isNaN(id)){
        res.status(400).send({error: "el id debe ser un numero"});
        return;
    };

  const usuario = usuarios.find((usuario) => usuario.id == id);

    if(usuario === undefined){
        res.status(404).send({error: `El usuario con id ${id} no existe` });
        return;
    }
    res.status(200).send(usuario);
} );// end point


//crear un nuevo punto de entrada

app.post("/usuarios", (req, res)=> {
    const {nombre,apellido,email} = req.body;

    //Validar los campos nombre, apellido, email
    if (!nombre) {
     res.status(400).json({ error: "El campo 'nombre' es obligatorio." });
     return;
    }

    if (!apellido) {
     res.status(400).json({ error: "El campo 'apellido' es obligatorio." });
     return;
    }

    if (!email) {
        return res.status(400).json({ error: "El campo 'email' es obligatorio." });
    }
    // Agregar el nuevo usuario si todos los campos son válidos
    usuarios.push({ id: usuarios.length + 1, nombre, apellido, email });
   
    
    res.status(201).send("El usuario se agregó correctamente");
});

   
   // usuarios.push({id: usuarios.length + 1, nombre, apellido, email});

    //res.status(201).send("El usuario se agrego correctamente");
   // });


app.listen(3000,()=> {
    console.log("Servidor corriendo en http://localhost:3000");
});


