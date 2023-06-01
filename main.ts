import express from "express";
import { Request, Response } from "express";
import {rankingRoutes} from "./rankingRoutes";
import { logger } from "./logger";
// import { homeRoutes} from "./homeRoutes";


//  Configure express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
// app.use("/",homeRoutes);
app.use('/ranking',rankingRoutes);

const PORT = 8080;
app.listen(PORT, () => {
	logger.info(`Listening at http://localhost:${PORT}/`);
});