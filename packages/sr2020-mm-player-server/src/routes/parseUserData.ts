import { Router } from 'express';
import { JWT_SECRET } from '../constants';
import * as jwt from "jsonwebtoken";
import { validateTokenData, AuthorizedRequest } from '../types';

const router = Router();

router.use((req1, res, next) => {
  const req = req1 as AuthorizedRequest;

  const { mm_token } = req.cookies;
  if (mm_token === undefined) {
    res.status(401).send('Request has no user token');
    return;
  }

  try {
    const parsedToken = jwt.verify(mm_token, JWT_SECRET);
    console.log('parsedToken', parsedToken);
    if (!validateTokenData(parsedToken)) {
      res.status(500).send(`parsedToken verification failed ${JSON.stringify(parsedToken)} ${JSON.stringify(validateTokenData.errors)}`);
      return;
    }
    req.userData = parsedToken;
    next();
  } catch (err) {
    res.status(500).send(`User token verification failed ${JSON.stringify(err)}`);
    return;
  }
});

router.use('/api/secureEndpoint', (req, res, next) => {
  res.json({
    message: 'Secure endpoint answer',
    date: new Date(),
  });
});

export const parseUserData = router;
