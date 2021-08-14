import express from "express";

export class ModelController {
    private model: any;

    constructor(model: any) {
        this.model = new model()
    }

    create(req: express.Request, res: express.Response) {
        this.model.object.insert(req.body, function (err: any, result: any) {
            if (err) throw err;
            res.send(result);
        })
    }

    list(req: express.Request, res: express.Response) {
        this.model.object.find({}).toArray(function (err: any, result: any) {
            if (err) throw err;
            res.send(result);
        });
    }

    retrieve(req: express.Request, res: express.Response) {

    }

    update(req: express.Request, res: express.Response) {

    }

    destroy(req: express.Request, res: express.Response) {

    }
}