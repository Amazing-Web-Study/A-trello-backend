import express from "express";
import {CardModel} from "./models";


export async function getCards(req: express.Request, res: express.Response) {
    let card = new CardModel()

    card.object.find({}).toArray(function (err: any, result: any) {
        if (err) throw err;
        res.send(result);
    });
}