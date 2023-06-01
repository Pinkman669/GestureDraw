import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("scores").del();

    // Inserts seed entries
   await knex.insert([
        {username: "user1", score: "100"},
        {username: "user2", score: "74" },
        {username: "user3", score: "80" },
        {username: "user4", score: "10"},
        {username: "user5", score: "30" },
        {username: "user6", score: "65" },
        {username: "user7", score: "70"},
        {username: "user8", score: "90" },
        {username: "user9", score: "50" },
        {username: "user10", score: "40"},
        {username: "user11", score: "20"},
        {username: "user12", score: "10"},
        {username: "user13", score: "15"},
        {username: "user14", score: "95"},
    ])
    .into("scores")
};
