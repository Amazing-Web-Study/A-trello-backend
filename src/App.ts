import express from 'express';
import {Connection} from './db';
import {mongoConfig, DatabaseConfigType} from './config/database';

class App {
    public application: express.Application;
    private dbConfig: DatabaseConfigType;

    constructor() {
        this.dbConfig = mongoConfig()
        this.application = express();
        this.application.use(express.json());
        Connection.db = null
        Connection.url = this.dbConfig.host
        Connection.open().then((r: any) => {
            console.log(r)
        })
        this.router();
    }

    private async router(): Promise<void> {
        this.application.get('/', (req: express.Request, res: express.Response) => {
            Connection.collection('cardmodel').find({}).toArray(function (err: any, result: any) {
                if (err) throw err;
                res.send(result);
            })
        })

        //signup
        this.application.post('/user', (req: express.Request, res: express.Response) => {
            const {id, password, name} = req.body;
            interface userSchema {
                id: string,
                password: string,
                name: string,
            }
            let user: userSchema;
            user ={
                id,
                password,
                name
            }

            const existUser = Connection.collection('user').findOne({id})
            existUser.then((doc: any) => {
                if(!doc) {
                    Connection.collection('user').insertOne(user)
                        .then((result: any) => {
                            console.log(`Success! id: ${result.insertedId}`)
                            res.send('success')
                        })
                        .catch((err: any) => {
                            console.error(`Failed to insert item. id: ${err}`)
                            res.send('fail')
                        })
    
                }
                else res.send('already user exists')
            })
        })

        //login
        this.application.post('/login', (req: express.Request, res: express.Response) => {
            const {id, password} = req.body;
            interface loginSchema {
                id: string,
                password: string
            }
            let login: loginSchema;
            login ={
                id,
                password
            }

            const existUser = Connection.collection('user').findOne({id})
            existUser.then((doc: any) => {
                if(!doc) {
                    res.send('id를 확인하세요')
                }
                else {
                    if(doc.password === login.password) res.send('login success')
                    else res.send('비밀번호를 확인하세요')
                }
            })
        })

        //list 추가
        this.application.post('/list', (req: express.Request, res: express.Response) => {
            const {userid, title} = req.body;
            interface listSchema {
                title: string,
            }
            let list: listSchema;
            list ={
                title
            }
            Connection.collection('list').insertOne(list)
                .then((result: any) => {
                    var list_id = result.insertedId
                    const updateUser = Connection.collection('user').findOneAndUpdate({id: userid},{"$push" : {list_id}})
                    updateUser.then((doc: any) => {
                        if(!doc) {
                            res.send('id를 확인하세요')
                        }
                        else {
                            console.log(`Success! id: ${result.insertedId}`)
                            res.send('success')
                        }
                    })
                })
                .catch((err: any) => {
                    console.error(`Failed to insert list. id: ${err}`)
                    res.send('fail')
                })
        })

        //card 추가
        this.application.post('/card', (req: express.Request, res: express.Response) => {
            var ObjectId = require('mongodb').ObjectId
            const {list_id, title, description} = req.body;
            interface cardSchema {
                title: string,
                description: string,
            }
            let card: cardSchema;
            card ={
                title,
                description
            }
            var ObjectId = require('mongodb').ObjectId
            Connection.collection('card').insertOne(card)
                .then((result: any) => {
                    var card_id = result.insertedId
                    const updateList = Connection.collection('list').findOneAndUpdate({"_id": ObjectId(list_id)},{"$push" : {card_id}})
                    updateList.then((doc: any) => {
                        if(!doc) {
                            res.send('list id를 확인하세요')
                        }
                        else {
                            console.log(`Success! id: ${result.insertedId}`)
                            res.send('success')
                        }
                    })
                })
                .catch((err: any) => {
                    console.error(`Failed to insert card. id: ${err}`)
                    res.send('fail')
                })
        })
    }
}

export default App;