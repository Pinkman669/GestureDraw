import express from 'express';
import { Request, Response } from 'express';
import { logger } from './logger';
import Knex from "knex";

const knexConfigs = require("./knexfile");

const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const rankingRoutes = express.Router();

rankingRoutes.get('/ranking',rankingBoard)

export async function rankingBoard(req: Request, res: Response) {
	try {
        const top10 = await knex
        

        

	} catch (e) {
		logger.error('[Err001] Ranking history not Found' + e);
		res.json({ success: false, msg: '[ERR001]' });
	}};