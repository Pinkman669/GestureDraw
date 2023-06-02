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
}
