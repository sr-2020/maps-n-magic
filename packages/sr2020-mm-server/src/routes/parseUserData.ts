import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import { AuthorizedRequest, validateTokenData, mainServerConstants } from 'sr2020-mm-server-event-engine';
import { 
  createLogger 
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('parseUserData');

const router = Router();

router.use((req1, res, next) => {
  const req = req1 as AuthorizedRequest;

  const { mm_token } = req.cookies;
  if (mm_token === undefined) {
    res.status(401).send('Request has no user token');
    return;
  }

  try {
    const parsedToken = jwt.verify(mm_token, mainServerConstants().JWT_SECRET);
    logger.info('parsedToken', parsedToken);
    if (!validateTokenData(parsedToken)) {
      res.status(500).send(`parsedToken verification failed ${JSON.stringify(parsedToken)} ${JSON.stringify(validateTokenData.errors)}`);
      return;
    }
    req.userData = parsedToken;
    next();
  } catch (err) {
    logger.info('User token verification failed', err);
    res.status(500).send(`User token verification failed ${JSON.stringify(err)}`);
    return;
  }
});

export const parseUserData = router;
