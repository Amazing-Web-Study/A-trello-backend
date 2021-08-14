import express from 'express'
import cardRouter from "./card/router"
import * as bodyParser from "body-parser";

export default async function router(app:express.Application) {
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: false,
        }),
    );

    app.use('/card', cardRouter);
}
