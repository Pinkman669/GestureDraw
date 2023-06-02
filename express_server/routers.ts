import express from "express";
import { landingController, rankingController } from "./main";




export const rankingRoutes = () =>{
        const route = express.Router();
        route.get("/", rankingController.getRanking);
        return route;
};

export const landingRoutes = () =>{
        const route = express.Router();
        route.post("/", landingController.storeUsername);
        return route;
};



