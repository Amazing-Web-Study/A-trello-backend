import express from 'express';
import {getCards} from "./controller";

const router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => getCards(req, res))

export default router