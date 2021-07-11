import { Router } from 'express';
import { innerPostUserPosition } from 'sr2020-mm-server-event-engine';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";

const logger = createLogger('postUserPosition.ts');

export const postUserPosition = (req: Request, res: Response, next: NextFunction) => {
  const beacon = req.body;
  innerPostUserPosition(Number(req.params.characterId), beacon).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    logger.error(err);
    next(err);
  });
}
