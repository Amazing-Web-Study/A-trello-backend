import * as dotenv from 'dotenv'

dotenv.config()

declare var process: {
    env: {
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_NAME: string;
    }
}

export type DatabaseConfigType = {
    host: string;
    username: string;
    password: string;
    name: string;
}

export function mongoConfig(): DatabaseConfigType {
    return {
        host: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster.jccfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    }
}

const MongoClient = require('mongodb').MongoClient

export class Connection {
    static db: any;
    static url: string;

    static async open() {
        if (this.db) return this.db
        let mongoClient = await MongoClient.connect(this.url).catch((e: any) => {
            console.log(e)
        })
        this.db = mongoClient.db(process.env.DB_NAME)
        return this.db
    }

    static collection (collectionName:string) {
        return this.db.collection(collectionName)
    }
}