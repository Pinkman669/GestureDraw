import { Knex } from "knex";

export class RankingService{

    constructor(private knex: Knex) {

    }

    async getTop10(){
        return await this.knex
            .select('username','score')
            .from('scores')
            .orderBy('score', 'desc')
            .limit(10)
    }

    async getResultList(){
        return await this.knex
            .select('score', 'id')
            .from('scores')
            .orderBy('score', 'desc')
    }

    async addUserResult(username: string, score: number){
        return await this.knex
            .insert({
                'username': username,
                'score': score
            })
            .into('scores')
            .returning('id')
    }
}
