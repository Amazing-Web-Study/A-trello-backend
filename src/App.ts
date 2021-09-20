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
        this.application.use(cors( ));
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
                if(findDocument){
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
                if(findDocument){
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
                'cardList': req.body.cardList
            }
            Connection.collection('cardList').insertOne(insertCard).then((createDocument: any) => {
                res.send(createDocument)
            }).catch((err: any) => {
                res.send(err)
            })
        })
        this.application.post('/list/:listId/card', async (req: express.Request, res: express.Response) => {
            const query = { _id: new ObjectId(req.params.listId) }
            const insertCard = {
                "$push": {
                    "cardList": {
                        "title": req.body.title,
                        "description": req.body.description
                    }
                }
            }
            Connection.collection('cardList').find(query).toArray(function (err: any, result: any) {
                if (err) throw err;
                console.log(result)
            })
            const options = {returnNewDocument: true};
            Connection.collection('cardList').findOneAndUpdate(query, insertCard, options).then((updateDocument: any) => {
                console.log(updateDocument)
                res.send(updateDocument)
            }).catch((err: any) => {
                res.send(err)
            })
        })

        this.application.delete('/list/:listId', (req: express.Request, res: express.Response) => {
            const query = { _id: new ObjectId(req.params.listId) }
            console.log(query)
            Connection.collection('cardList').deleteOne(query)
                .then((result: any) => {
                    console.log(`Success!`)
                    res.send('success')
                })
                .catch((err: any) => {
                    console.error(`Failed to delete item. id: ${err}`)
                    res.send('fail')
                })
        })

        this.application.put('/list/:listId/:cardId', (req: express.Request, res: express.Response) => {
            const {title} = req.body;
            const query = { _id: new ObjectId(req.params.listId) }
            const cardId = parseInt(req.params.cardId)
            interface listSchema {
                title: string,
            }
            let list: listSchema;
            list ={
                title
            }

            var cardList: Array<Object> = []
            Connection.collection('cardList').find(query).toArray(function (err: any, result: any) {
                cardList = result[0].cardList;
                cardList.splice(cardId, 1)
                Connection.collection('cardList').updateOne(query, {"$set": {cardList}})
                    .then((result: any) => {
                        console.log(`Success!`)
                        res.send('success')
                    })
                    .catch((err: any) => {
                        console.error(`Failed to insert item. id: ${err}`)
                        res.send('fail')
                    })
            })
        })
    }
}

export default App;