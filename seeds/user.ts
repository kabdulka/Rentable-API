import { Knex } from "knex";

exports.seed = async function (knex: Knex) {
    await knex("users").del();
    await knex("users").insert([
    {
      id: 1,
      avatar_url: 'url1',
      username: 'kenabdulka',
      email: 'kenabdulka@gmail.com',
      password: '1234567',

    },
    {
      id: 2,
      avatar_url: 'url2',
      username: 'kabdulka',
      email: 'kenargentina@hotmail.com',
      password: '123456',
    },
    
  ]);
}