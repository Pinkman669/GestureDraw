import { Knex } from "knex";


export async function up(knex: Knex){
    await knex.schema.createTable('scores',table=>{
        table.increments()
        table.string("username")
        table.integer("score")
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex){
    await knex.schema.dropTable('scores')
}

