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
    }
}

export default App;