import express from 'express'
import {mongoConfig, DatabaseConfigType, Connection} from './config/database'
import router from './router'

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
        router(this.application);
    }
}

export default App;