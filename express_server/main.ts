import express from "express";
import Knex from "knex";
import { RankingService } from "./services/rankingService";
import { RankingController } from "./controllers/rankingController";
import { rankingRoutes, gameRoutes } from "./routers";
import expressSession from "express-session";
import { GameController } from "./controllers/gameController";


const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const rankingService = new RankingService(knex)
export const rankingController = new RankingController(rankingService);
export const gameController = new GameController()


const app = express()

app.use(
    expressSession({
        secret: "hand tracking project",
        resave: true,
        saveUninitialized: true,
    })
)
declare module "express-session" {
    interface SessionData {
        username?: string;
        userID?: number;
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2000kb' }));

app.use(express.static('public'))
app.use('/ranking', rankingRoutes());
app.use('/game', gameRoutes())

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
})