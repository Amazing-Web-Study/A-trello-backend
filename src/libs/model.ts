import {Connection} from "../config/database";

export class Model {
    public object:any

    constructor() {
        this.object = Connection.db.collection(this.constructor.name.toLowerCase())
    }
}