const pool = require("../db/connection");

const pokemonSeeder = async () =>{
    const {results} = await fetch ('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151').then(res => res.json());

   const pokemons = await Promise.all (
    results.map( async (poke)=> {
     const pokemon = await fetch(poke.url).then(res => res.json());
     

     return{
        name: poke.name,
        image: pokemon.sprites.other.dream_world.front_default,
     }
   })
);
   let coon;
   try{
    coon = await pool.getConnection();

    await coon.query('SET FOREIGN_KEY_CHECKS = 0');
    await coon.query('TRUNCATE pokemons');
    await coon.query('SET FOREIGN_KEY_CHECKS = 1');

    pokemons.forEach((pokemon) => {
        coon.query('INSERT INTO pokemons(name, image) VALUES (?, ?)', [
            pokemon.name,
            pokemon.image
        ])

    });
   }catch(err) {

   }finally {
    if (coon) coon.end();
   }
   
} 

module.exports = pokemonSeeder;