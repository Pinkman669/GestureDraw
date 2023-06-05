import express from "express";
import { Request, Response } from 'express'
import Knex from "knex";
import { RankingService } from "./services/rankingService";
import { RankingController } from "./controllers/rankingController";
import { rankingRoutes } from "./routers";


const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const rankingService = new RankingService(knex)
export const rankingController = new RankingController(rankingService);


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2000kb' }));

app.use(express.static('public'))
app.use('/ranking',rankingRoutes());


app.post('/frame', async (req: Request, res: Response) => {
    try {
        const frame = req.body.frame
        const resSanic = await fetch('http://127.0.0.1:8000/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ frame: frame }),
        })
        const result = await resSanic.json()
        res.json({ landmarksInPixel: result.landmarks_in_pixel, landmarks: result.landmarks , checkDraw: result.enable_draw, fingersUp: result.fingers_up})
    } catch (e) {
        console.log(e)
        res.json({success: false})
    }
})

app.post('/training', async (req:Request, res: Response)=>{
    try{
        const submission = req.body.submission
        const resSanic = await fetch('http://127.0.0.1:8000/training', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ submission: submission }),
        })
        const result = await resSanic.json()
        res.json({ success: true , msg: result})
    } catch(e){
        console.log(e)
        res.json({success: false})
    }
})

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
})