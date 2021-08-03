import { Router } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import * as jwt from "jsonwebtoken";
import { isErrorResponse, ErrorResponse, validateTokenData, validateWeakTokenData } from 'sr2020-mm-event-engine';
import { mainServerConstants, MainAuthorizedRequest } from 'sr2020-mm-server-event-engine';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('gatekeepers/api.ts');

export const apiGatekeeper = (req1: Request, res: Response, next: NextFunction) => {
  const req = req1 as MainAuthorizedRequest;

  const { mm_token } = req.cookies;
  if (mm_token === undefined) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'В запросе нет пользовательского токена',
      errorSubtitle: ''
    };
    res.status(401).json(errorResponse);
    return;
  }

  try {
    const parsedToken = jwt.verify(mm_token, mainServerConstants().JWT_SECRET);
    // logger.info('parsedToken', parsedToken);
    if (!validateWeakTokenData(parsedToken)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Данные авторизации некорректны',
        errorSubtitle: `Данные ${JSON.stringify(parsedToken)}, ошибки ${JSON.stringify(validateWeakTokenData.errors)}`
      };
      res.status(500).json(errorResponse);
      // res.status(500).send(`parseUserData: parsedToken verification failed ${JSON.stringify(parsedToken)} ${JSON.stringify(validateTokenData.errors)}`);
      return;
    }
    req.userData = parsedToken;
    next();
  } catch (err) {
    logger.info('User token verification failed', err);
    const errorResponse: ErrorResponse = {
      errorTitle: 'Пользователь не авторизован',
      errorSubtitle: `Ошибка ${JSON.stringify(err)}`
    };
    res.status(500).json(errorResponse);
    // res.status(500).send(`parseUserData: User token verification failed ${JSON.stringify(err)}`);
    return;
  }
}