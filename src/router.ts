import express from 'express'
import cardRouter from "./card/router"

export default async function router(app:express.Application) {
    app.use('/card', cardRouter);
}
