import { isErrorResponse, ErrorResponse, validateTokenData, validateWeakTokenData } from 'sr2020-mm-event-engine';
import { mainServerConstants, MainAuthorizedRequest } from 'sr2020-mm-server-event-engine';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";

const logger = createLogger('isLoggedIn.ts');

export const isLoggedIn = (req1: Request, res: Response) => {
  const req = req1 as MainAuthorizedRequest;
  logger.info('/api/isLoggedIn');
  // if we are here then parsing user data was successful
  res.status(200).json(req.userData);
}
