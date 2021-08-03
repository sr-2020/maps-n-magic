import { Router } from 'express';
import { innerPostUserPosition, mmLog } from 'sr2020-mm-server-event-engine';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";

const logger = createLogger('postUserPosition.ts');

export const postUserPosition = (req: Request, res: Response, next: NextFunction) => {
  const beacon = req.body;
  innerPostUserPosition(Number(req.params.characterId), beacon).then(() => {
    res.sendStatus(200);
    logger.info('POST_USER_POSITION_SUCCESS', `characterId ${req.params.characterId}, beacon ${JSON.stringify(beacon)}`);
    mmLog('POST_USER_POSITION_SUCCESS', `characterId ${req.params.characterId}, beacon ${JSON.stringify(beacon)}`);
  }).catch((err) => {
    logger.error(err);
    logger.info('POST_USER_POSITION_FAIL', `characterId ${req.params.characterId}, beacon ${JSON.stringify(beacon)}, err ${JSON.stringify(err)}`);
    mmLog('POST_USER_POSITION_FAIL', `characterId ${req.params.characterId}, beacon ${JSON.stringify(beacon)}, err ${JSON.stringify(err)}`);
    next(err);
  });
}
