
import { Request, Response } from 'express';
import { logger } from '../logger';
import { RankingService } from '../services/rankingService';


export class RankingController{
	constructor(private rankingService: RankingService){}

	getRanking = async( req: Request, res:Response) =>{
		try{
			const result = await this.rankingService.getTop10()
			res.json({result})
		}catch (e) {
			logger.error('[Err001] Ranking history not Found' + e);
			res.json({ success: false, msg: '[ERR001]' });
		}};
	

	getUserRank = async (req: Request, res:Response) =>{
		try{
			const userID = Number(req.body.userID)
			// const userScore = await this.rankingService.getUserResult(userID!)[0]
			const resultList = await this.rankingService.getResultList()
			let userRank: number = 0
			resultList.forEach((result, index)=>{
				if (result.id === userID){
					userRank = index + 1
				}
			})
			res.json({success: true, rank: userRank})
		}catch(e){
			logger.error(`[Err005] Cannot get user result ${e}`)
			res.json({success: false, msg: e})
		}
	}

	addUserResult = async (req: Request, res:Response) =>{
		try{
			const {username, score} = req.body
			const userID = await this.rankingService.addUserResult(username, score)
			res.json({success: true, userID: userID[0].id})
		}catch(e){
			logger.error(`[Err006] Cannot add user result ${e}`)
			res.json({success: false, msg: e})
		}
	}
}

	
	