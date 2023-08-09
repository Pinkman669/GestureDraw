import express from "express";
import {  gameController, rankingController } from "./main";


export const rankingRoutes = () =>{
        const route = express.Router();
        route.get("/", rankingController.getRanking);
        route.post('/addUser', rankingController.addUserResult)
        route.post('/getUserRank', rankingController.getUserRank)
        return route;
};

export const gameRoutes = () =>{
        const route = express.Router()
        route.post('/frame', gameController.postFrame)
        route.post('/training', gameController.postTraining)
        route.post('/count-down', gameController.postCountDown)
        return route
}




