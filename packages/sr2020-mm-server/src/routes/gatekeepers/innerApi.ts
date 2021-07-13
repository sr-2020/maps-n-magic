import { GameModel } from "sr2020-mm-event-engine";
import { createLogger, InnerApiRequest, mainServerConstants } from "sr2020-mm-server-event-engine";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express-serve-static-core";

const logger = createLogger('gatekeepers/innerApi.ts');

export const getInnerApiGatekeeper = (gameModel: GameModel) => {
  return (req1: Request, res: Response, next: NextFunction) => {
    const req = req1 as InnerApiRequest;
  
    const { mm_token } = req.cookies;
    if (mm_token === undefined) {
      logger.info('innerApi connection FAILED: Request has no user token');
      res.status(401).send('Request has no user token');
      return;
    }
  
    try {
      const parsedToken = jwt.verify(mm_token, mainServerConstants().JWT_SECRET);
      // logger.info('parsedToken', parsedToken);
  
      if (parsedToken !== mainServerConstants().playerServerTokenPayload) {
        logger.info('innerApi connection FAILED: token parsing');
        res.status(401).send('Error on token parsing');
        return;
      }
    } catch (err) {
      logger.error('innerApi connection FAILED: Error on token parsing', err);
      res.status(401).send('Error on token parsing');
      return;
    }
  
    req.gameModel = gameModel;
  
    next();
  }
}