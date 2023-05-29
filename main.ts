import express from "express";
import { Request, Response } from 'express'

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'))

app.get('/', (req: Request, res: Response)=>{
    res.json({success: true})
})

const PORT = 8080

app.listen(PORT, ()=>{
    console.log(`Listening at http://localhost:${PORT}/`);
})