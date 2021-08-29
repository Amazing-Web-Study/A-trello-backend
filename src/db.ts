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

        const cardListCollection = Connection.collection('cardList')
        const userCollection = Connection.collection('user')
        const tokenCollection = Connection.collection('token')

        if (!cardListCollection) {
            this.createCardListCollection()
        }
        if(!userCollection){
            this.createUserCollection()
        }
        if(!tokenCollection){
            this.createTokenCollection()
        }

        return this.db
    }

    static collection(collectionName: string) {
        return this.db.collection(collectionName)
    }
    static createTokenCollection() {
        return this.db.createCollection('token', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["id", "name"],
                    properties: {
                        id: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            },
            validationLevel: "moderate"
        })
    }
    static createUserCollection() {
        return this.db.createCollection('user', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title"],
                    properties: {
                        id: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            },
            validationLevel: "moderate"
        })
    }
    static createCardListCollection() {
        return this.db.createCollection('cardList', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title", "authorId"],
                    properties: {
                        title: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        authorId: {
                            bsonType: "objectId",
                            description: "must be a object id and is required"
                        },
                        cardList: {
                            bsonType: "object",
                            required: ["title", "description"],
                            description: "must be a object",
                            properties: {
                                title: {
                                    bsonType: "string",
                                    description: "must be a string and is required"
                                },
                                description: {
                                    bsonType: "string",
                                    description: "must be a string and is required"
                                }
                            },
                            autoIndexId: true
                        }
                    }
                }
            },
            validationLevel: "moderate"
        })
    }
}