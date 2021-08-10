const MongoClient = require('mongodb').MongoClient

export default class Connection {
    static db: any;
    static url: string;

    static async open() {
        if (this.db) return this.db
        this.db = await MongoClient.connect(this.url).catch((e: any) => {
            console.log(e)
        })
        return this.db
    }
}