import express from "express";
import { Request, Response } from 'express'

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2000kb' }));

app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
    console.log('yes')
    res.json({ success: true })
})

app.post('/', async (req: Request, res: Response) => {
    try {
        const frame = req.body.frame
        const resSanic = await fetch('http://127.0.0.1:8000/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ frame: frame }),
        })
        console.log("sent to sanic")
        const result = await resSanic.json()
        res.json({ handDetection: result.frame })
    } catch (e) {
        console.log(e)
    }
})

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
})