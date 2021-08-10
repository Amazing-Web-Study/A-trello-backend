import express from 'express';
import Connection from './db';
import {mongoConfig, DatabaseConfigType} from './config/database';

class App {
    public application: express.Application;
    private database: DatabaseConfigType;

    constructor() {
        this.database = mongoConfig()
        this.application = express();
        Connection.db = null
        Connection.url = this.database.host
        Connection.open().then(r => {
            console.log(r)
        })
        this.router();
    }

    private async router(): Promise<void> {
        this.application.get('/', (req: express.Request, res: express.Response) => {
            res.send('hello!');
        })
    }
}

export default App;