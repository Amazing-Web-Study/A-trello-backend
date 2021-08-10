import * as dotenv from 'dotenv'

dotenv.config()

declare var process : {
    env: {
        DB_USERNAME: string;
        DB_PASSWORD: string;
    }
}

export type DatabaseConfigType = {
    host: string;
    username: string;
    password: string;
}

export function mongoConfig(): DatabaseConfigType {
    return {
        host: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster.jccfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    }
};
