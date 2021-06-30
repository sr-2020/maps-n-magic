import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import { 
  validateAuthRequest, 
  validateTokenData, 
  validateTokenRequestBody,
  mainServerConstants,
  getUserTokenData,
  createLogger
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('login');

const router = Router();

router.get('/api/isLoggedIn', (req, res, next) => {
  // logger.info('req.cookies', req.cookies);
  const { mm_token } = req.cookies;
  logger.info('isLoggedIn', mm_token);
  if (mm_token === undefined) {
    res.status(401).end();
  } else {
    res.status(200).end();
  }
});

router.post('/api/login', async (req, res) => {
  logger.info('/api/login', req.body);

  const authRequest = req.body;
  if (!validateAuthRequest(authRequest)) {
    res.status(400).send(`auth request verification failed ${JSON.stringify(authRequest)} ${JSON.stringify(validateAuthRequest.errors)}`);
    return;
  }

  const res2 = await getUserTokenData(authRequest.username, authRequest.password);
  if (res2.status === 200) {
    const data = await res2.json();
    if (!validateTokenRequestBody(data)) {
      res.status(500).send(`User token data not valid ${JSON.stringify(validateTokenRequestBody.errors)}`);
      return;
    }

    const { api_key } = data;

    // logger.info('test call', res2.status, data);
  
    try {
      const parsedToken = jwt.verify(api_key, mainServerConstants().JWT_SECRET);
      logger.info('parsedToken', parsedToken);
      if (!validateTokenData(parsedToken)) {
        res.status(500).send(`parsedToken verification failed ${JSON.stringify(parsedToken)} ${JSON.stringify(validateTokenData.errors)}`);
        return;
      }

      const { auth } = parsedToken;
      if (!auth.includes('ROLE_MASTER')) {
        res.status(400).send(`У вас нет роли MASTER`);
        return;
      }

      // const data = await getCharacterModelData(authRequest.username);
      // logger.info(data);

      res.cookie('mm_token', api_key, { httpOnly: true });
      const { body } = req;
      logger.info('body', body);
      res.json(parsedToken);
    } catch (err) {
      logger.info('User token verification failed', err);
      res.status(500).send(`User token verification failed ${JSON.stringify(err)}`);
      return;
    }
  } else {
    const text = await res2.text();
    res.status(res2.status).send(`User unathorized: ${text}`);
  }
});

export const loginRouter = router;



