import { Request, Response } from 'express';
import { logger } from '../logger';




export class gameController{
	constructor(private rankingService: RankingService){}

	getRanking = async( req: Request, res:Response) =>{
		try{
			const result = await this.rankingService.getTop10()
			res.json({result})
		}catch (e) {
			logger.error('[Err001] Ranking history not Found' + e);
			res.json({ success: false, msg: '[ERR001]' });
		}};
	}