import express from 'express';
import {Connection} from './db';
import {mongoConfig, DatabaseConfigType} from './config/database';
import {ObjectId} from "mongodb";
import cors from 'cors';

class App {
    public application: express.Application;
    private dbConfig: DatabaseConfigType;

    constructor() {
        this.dbConfig = mongoConfig()
        this.application = express();
        this.application.use(cors());
        this.application.use(express.json());
        this.application.use(express.urlencoded({extended: false}));
        Connection.db = null
        Connection.url = this.dbConfig.host
        Connection.open().then((r: any) => {
            console.log(r)
        })
        this.router();
    }

    private async router(): Promise<void> {
        this.application.post('/login/', (req: express.Request, res: express.Response) => {
            const loginData = {
                id: req.body.id,
                password: req.body.password
            }
            Connection.collection('user').findOne(loginData).then((findDocument: any) => {
                if (findDocument) {
                    const tokenData = {
                        _id: findDocument._id,
                        id: findDocument.id,
                        name: findDocument.name
                    }
                    Connection.collection('token').insertOne(tokenData).then((createDocument: any) => {
                        res.send(createDocument)
                    }).catch((err: any) => {
                        res.send(err)
                    })
                }
            }).catch((err: any) => {
                res.send(err)
            })
        })
        this.application.post('/user/token/', (req: express.Request, res: express.Response) => {
            const tokenData = {
                _id: new ObjectId(req.body.token)
            }
            Connection.collection('token').findOne(tokenData).then((findDocument: any) => {
                if (findDocument) {
                    res.send(findDocument)
                } else {
                    throw findDocument;
                }
            }).catch((err: any) => {
                res.status(400)
                res.send("don't find user token")
            })
        })
        this.application.post('/user/', (req: express.Request, res: express.Response) => {
            const insertUser = {
                id: req.body.id,
                password: req.body.password,
                name: req.body.name
            }
            Connection.collection('user').insertOne(insertUser).then((createDocument: any) => {
                res.send(createDocument)
            }).catch((err: any) => {
                res.send(err)
            })
        })
        this.application.get('/list/', (req: express.Request, res: express.Response) => {
            Connection.collection('cardList').find({}).toArray(function (err: any, result: any) {
                console.log(err)
                if (err) throw err;
                res.send(result);
            })
        })
        this.application.post('/list/', (req: express.Request, res: express.Response) => {
            const insertCard = {
                'title': req.body.title,
                'cardList': []
            }
            Connection.collection('cardList').insertOne(insertCard).then((createDocument: any) => {
                res.send(createDocument)
            }).catch((err: any) => {
                res.send(err)
            })
        })
        this.application.put('/list/:listId/', (req: express.Request, res: express.Response) => {
            const query = {
                _id: new ObjectId(req.params.listId)
            }
            const upsetCard = {
                "$set": {
                    ...req.body.title ? {
                        "title": req.body.title,
                    } : {},
                }
            }
            const options = {returnNewDocument: true};
            Connection.collection('cardList').findOneAndUpdate(query, upsetCard, options).then((deleteCard: any) => {
                res.send(deleteCard)
            }).catch((err: any) => {
                res.status(500)
                res.send(err)
            })
        })
        this.application.delete('/list/:listId/', (req: express.Request, res: express.Response) => {
            const query = {_id: new ObjectId(req.params.listId)}
            const options = {
                justOne: true,
            }
            Connection.collection('cardList').remove(query, options).then((createDocument: any) => {
                res.send(createDocument)
            }).catch((err: any) => {
                res.send(err)
            })
        })
        this.application.post('/list/:listId/card', async (req: express.Request, res: express.Response) => {
            const query = {_id: new ObjectId(req.params.listId)}
            const insertCard = {
                "$push": {
                    "cardList": {
                        "_id": new ObjectId(),
                        "title": req.body.title,
                        "description": req.body.description
                    }
                }
            }
            const options = {returnNewDocument: true};
            Connection.collection('cardList').findOneAndUpdate(query, insertCard, options).then((updateDocument: any) => {
                console.log('aaaa')
                res.send(updateDocument)
            }).catch((err: any) => {
                console.log(err)
                res.status(500)
                res.send(err)
            })
        })
        this.application.put('/list/:listId/:cardId', (req: express.Request, res: express.Response) => {
            const query = {
                _id: new ObjectId(req.params.listId),
                "cardList._id": new ObjectId(req.params.cardId)
            }
            const upsetCard = {
                "$set": {
                    ...req.body.title ? {
                        "cardList.$.title": req.body.title,
                    } : {},
                    ...req.body.description ? {
                        "cardList.$.description": req.body.description
                    } : {}
                }
            }
            const options = {returnNewDocument: true};
            Connection.collection('cardList').findOneAndUpdate(query, upsetCard, options).then((deleteCard: any) => {
                res.send(deleteCard)
            }).catch((err: any) => {
                res.status(500)
                res.send(err)
            })
        })
        this.application.delete('/list/:listId/:cardId', (req: express.Request, res: express.Response) => {
            const query = {_id: new ObjectId(req.params.listId)}
            const upsetCard = {
                "$pull": {
                    "cardList": {
                        "_id": new ObjectId(req.params.cardId)
                    }
                }
            }
            const options = {returnNewDocument: true};
            Connection.collection('cardList').findOneAndUpdate(query, upsetCard, options).then((deleteCard: any) => {
                res.send(deleteCard)
            }).catch((err: any) => {
                res.status(500)
                res.send(err)
            })
        })
    }
}

export default App;