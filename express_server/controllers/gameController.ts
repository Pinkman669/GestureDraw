import { Request, Response } from 'express';
import { logger } from '../logger';

export class GameController {
    constructor() {

    }
    postFrame = async (req: Request, res: Response) => {
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
                logger.error(`[Err002] hand tracking error`)
                res.json({success: false, msg: e})
            }
    }
    postTraining = async (req: Request, res: Response) => {
        try {
            const submission = req.body.submission
            const resSanic = await fetch('http://127.0.0.1:8000/training', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ submission: submission, challenge: challenge }),
            })
            const result = await resSanic.json()
            res.json({ success: true, score: result.score })
        } catch (e) {
            logger.error(`[Err003] submission error`)
            res.json({ success: false, msg: e })
        }
    }
    postCountDown = async (req: Request, res: Response) =>{
        try{
            const submissionSet = req.body.submissionSet
            req.session.username = req.body.username
            const username = req.session.username
            const resSanic = await fetch('http://127.0.0.1:8000/count-down',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionSet),
            })

            const result = await resSanic.json()
            const resAddUser = await fetch('http://127.0.0.1:8080/ranking/addUser',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({score: result.score, username:  username}),
            })
            const resultAddUser = await resAddUser.json()
            req.session.userID = resultAddUser.userID
            const resGetUserRank = await fetch('http://127.0.0.1:8080/ranking/getUserRank')
            const resultGetUserRank = await resGetUserRank.json()
            res.json({success: true, rank: resultGetUserRank.rank, score: result.score, username: username})
        }catch(e){
            logger.error(`[Err004] submission error`)
            res.json({ success: false, msg: e })
        }
    }
}