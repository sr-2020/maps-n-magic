import { Router } from 'express';
import { MainAuthorizedRequest, mmLog, PostUserPosition } from 'sr2020-mm-server-event-engine';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";
import { validateBeaconRecord } from 'sr2020-mm-event-engine';

const logger = createLogger('postUserPosition.ts');

export const postUserPosition = (req1: Request, res: Response, next: NextFunction) => {
  const req = req1 as MainAuthorizedRequest;
  const beacon = req.body;
  const { gameModel } = req;
  if (!validateBeaconRecord(beacon)) {
    throw new Error("Post beacon is not valid " + 
      JSON.stringify(beacon) + ", " + 
      JSON.stringify(validateBeaconRecord.errors)
    );
  }
  gameModel.get2<PostUserPosition>({
    type: 'postUserPosition',
    characterId: Number(req.params.characterId),
    ssid: beacon.ssid
  }).then(() => {
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
