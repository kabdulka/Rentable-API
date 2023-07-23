import { table } from "console";
import { Knex } from "knex";

exports.up = function(knex: Knex) {
    return knex.schema 
    .createTable("users", (table) => {
        table.increments('id').primary();
        // table.integer('github_id').notNullable();
        table.string('avatar_url').notNullable();
        table.string('username').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    
}

exports.down = function (knex: Knex) {
    return knex.schema.dropTable('users');
  };

