
import { Request, Response } from 'express';
import { logger } from '../logger';

export class LandingController{
	storeUsername = async( req: Request, res:Response) =>{
		try{
            
			res.json({})
		}catch (e) {
			logger.error('[Err002] username not store' + e);
			res.json({ success: false, msg: '[ERR002]' });
		}};
	}