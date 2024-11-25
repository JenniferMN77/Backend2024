const express = require('express');
const usersRoutes = require('./routes/users');
const staffRoutes = require('./routes/staff');
const products_suppliersRoutes = require('./routes/products_suppliers'); // Importa las rutas de products_suppliers
const suppliersRoutes = require('./routes/suppliers');
const productsRoutes = require ('./routes/products');

class Server{
    constructor() {
        this.app = express();
        this.port = 3000;

        this.app.use(express.json()); // es un middleware intetrceta la solicitud antes 

        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/users', usersRoutes); 
        this.app.use('/staff', staffRoutes);
        this.app.use('/suppliers', suppliersRoutes);
        this.app.use('/products', productsRoutes);
        this.app.use('/products_suppliers', products_suppliersRoutes); // Rutas de products_suppliers
    }

    start() {
        this.app.listen(this.port, ()=>{
            console.log('Server listenig on port ' + this.port);
         });
    } 
}

module.exports = {Server};