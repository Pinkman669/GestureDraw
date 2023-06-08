import express from "express";
import {  rankingController } from "./main";
import { GameController } from "./controllers/gameController";


export const rankingRoutes = () =>{
        const route = express.Router();
        route.get("/", rankingController.getRanking);
        route.post('/addUser', rankingController.addUserResult)
        route.get('/getUserRank', rankingController.getUserRank)
        return route;
};

export const gameRoutes = () =>{
        const route = express.Router()
        const gameController = new GameController()
        route.post('/frame', gameController.postFrame)
        route.post('/training', gameController.postTraining)
        route.post('/count-down', gameController.postCountDown)
        return route
}




