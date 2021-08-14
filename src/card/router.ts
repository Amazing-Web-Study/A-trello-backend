import express from 'express';
import {CardModelController} from "./controller";

const router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => new CardModelController().list(req, res))
router.post('/', (req: express.Request, res: express.Response) => new CardModelController().create(req, res))

export default router