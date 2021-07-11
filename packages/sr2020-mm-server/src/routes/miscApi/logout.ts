import { Router } from 'express';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";

const logger = createLogger('logout.ts');

export const logout = (req: Request, res: Response) => {
  logger.info('/api/logout');
  // req.logOut();
  res.status(200).clearCookie('mm_token', {
    // path: '/',
    // secure: false,
    httpOnly: true,
    // domain: 'place.your.domain.name.here.com',
    // sameSite: true,
  });
  res.end();
  // req.session.destroy(function (err) {
  //   res.redirect('/');
  // });
}
