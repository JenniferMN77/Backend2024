const express = require('express');

const app = express();

app.get("/",(req, res) => {
    res.status(200).send("Hola mundo!!!");
}); //GET cuando queramos obtener informacion

app.get("/prueba",(req, res) => {
    res.status(200).send("Hola desde la ruta de prueba");
}); //GET cuando queramos obtener informacion

app.post("/",(req, res) => {
    res.status(200).send("Hola desde post");
}); //POST crear un nuevo recurso o acceder a un recurso

app.put("/",(req, res) => {
    res.status(200).send("Hola desde PUT");
});//PUT para Actualizar un recurso.... completamente

app.patch("/",(req, res) => {
    res.status(200).send("Hola desde PATCH holis");
});//PATCH Actualizar un recurso parcialmente.... 

app.delete("/",(req, res) => {
    res.status(200).send("Hola desde DELETE");
});// DELETE elimina un recurso... entender que hay dos tipos de eliminacion hard o soft.... soft modifica un campo de registro

app.listen(3000,()=> {

    console.log("Servidor corriendo en http://localhost:3000");

});
