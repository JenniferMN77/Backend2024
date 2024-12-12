const {request, response} = require ('express');
const pool = require('../db/connection');
const pokemonsModel = require('../models/pokemons');


const getAllPokemons = async (req = request, res = response) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const pokemons = await conn.query(pokemonsModel.getAll);
        res.send(pokemons);


    }catch (err){
        res.status(500).json(err);
        return;
    }finally{
        if (conn) conn.end();
    }
};

const getPokemonById = async (req = request, res = response) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const pokemon = await conn.query(pokemonsModel.getById, [id]);
        if (pokemon.length === 0) {
            res.status(404).json({ msg: `No se encontró el Pokémon con ID ${id}` });
            return;
        }
        res.json(pokemon);
    } catch (err) {
        res.status(500).json(err);
    } finally {
        if (conn) conn.end();
    }

};

//para obtener 3 pokemones aleatoriamente
const get3RandomPokemons = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const pokemons = await conn.query(pokemonsModel.get3Random);
        res.send(pokemons);
    } catch (err) {
        res.status(500).json(err);
        return;
    } finally {
        if (conn) conn.end();
    }

};

const createPokemon = async (req = request, res = response) => {
    const { name, image } = req.body;

    if (!name || !image) {
        res.status(400).json({ msg: 'Faltan datos (name, image)' });
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(pokemonsModel.create, [name, image]);
        res.json({ msg: `Pokémon ${name} creado exitosamente.` });
    } catch (err) {
        res.status(500).json(err);
    } finally {
        if (conn) conn.end();
    } 
};

const updatePokemon = async (req = request, res = response) => {
    const { id } = req.params;
    const { name, image } = req.body;

    if (!name || !image) {
        res.status(400).json({ msg: 'Faltan datos (name, image)' });
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(pokemonsModel.update, [name, image, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ msg: 'No se encontró el Pokémon con ID ${id}' });
            return;
        }
        res.json({ msg: `Pokémon con ID ${id} actualizado exitosamente.` });
    } catch (err) {
        res.status(500).json(err);
    } finally {
        if (conn) conn.end();
    }
}

const deletePokemon = async (req = request, res = response) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(pokemonsModel.delete, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ msg: `No se encontró el Pokémon con ID ${id}` });
            return;
        }
        res.json({ msg: `Pokémon con ID ${id} eliminado exitosamente.` });
    } catch (err) {
        res.status(500).json(err);
    } finally {
        if (conn) conn.end();
    }
}

module.exports = {
    getAllPokemons,
    getPokemonById,
    get3RandomPokemons,
    createPokemon,
    updatePokemon,
    deletePokemon
};