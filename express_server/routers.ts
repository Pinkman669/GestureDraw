import express from "express";
import { rankingController } from "./main";




export const rankingRoutes = () =>{
        const route = express.Router();
        route.get("/", rankingController.getRanking);
        return route;
};



