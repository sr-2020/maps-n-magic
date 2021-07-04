import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import { 
  ErrorResponse,
  validateTokenData,
  TokenData,
  WeakTokenData,
  validateWeakTokenData
} from 'sr2020-mm-event-engine';
import { 
  validateAuthRequest, 
  validateTokenRequestBody,
  mainServerConstants,
  getUserTokenData,
  createLogger,
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('login.ts');

const router = Router();

router.post('/api/login', async (req, res) => {
  // logger.info('/api/login', req.body);

  const authRequest = req.body;
  if (!validateAuthRequest(authRequest)) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Формат данных запроса некорректен',
      errorSubtitle: `Данные ${JSON.stringify(authRequest)}, ошибки ${JSON.stringify(validateAuthRequest.errors)}`
    };
    res.status(400).json(errorResponse);
    return;
  }

  if (authRequest.username === 'emercom') {
    if (authRequest.password === mainServerConstants().EMERCOM_PASSWORD) {
      const parsedToken: WeakTokenData = {
        "sub": "EMERCOM",
        "auth": "ROLE_EMERCOM",
        // "modelId": -1,
        // "characterId": -1,
        "exp": 1668296003
      };

      const api_key = jwt.sign(parsedToken, mainServerConstants().JWT_SECRET);
      res.cookie('mm_token', api_key, { httpOnly: true });
      res.json(parsedToken);
      return;
    } else {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Неправильный пароль',
        errorSubtitle: ''
      };
      res.status(401).json(errorResponse);
      return;
    }
  }

  const res2 = await getUserTokenData(authRequest.username, authRequest.password);
  if (res2.status === 200) {
    const data = await res2.json();
    if (!validateTokenRequestBody(data)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Данные токена некорректны',
        errorSubtitle: `Данные ${JSON.stringify(data)}, ошибка ${JSON.stringify(validateTokenRequestBody.errors)}`
      };
      res.status(500).json(errorResponse);
      
      // res.status(500).send(`User token data not valid ${JSON.stringify(validateTokenRequestBody.errors)}`);
      return;
    }

    const { api_key } = data;

    // logger.info('test call', res2.status, data);
  
    try {
      const parsedToken = jwt.verify(api_key, mainServerConstants().JWT_SECRET);
      logger.info('parsedToken', parsedToken);
      if (!validateWeakTokenData(parsedToken)) {
        const errorResponse: ErrorResponse = {
          errorTitle: 'Данные авторизации некорректны',
          errorSubtitle: `Данные ${JSON.stringify(parsedToken)}, ошибка ${JSON.stringify(validateWeakTokenData.errors)}`
        };
        res.status(500).json(errorResponse);
        // res.status(500).send(`parsedToken verification failed ${JSON.stringify(parsedToken)} ${JSON.stringify(validateTokenData.errors)}`);
        return;
      }

      const { auth } = parsedToken;
      if (!auth.includes('ROLE_MASTER')) {
        const errorResponse: ErrorResponse = {
          errorTitle: 'У вас нет роли MASTER',
          errorSubtitle: ``
        };
        res.status(400).json(errorResponse);
        // res.status(400).send(`У вас нет роли MASTER`);
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
      const errorResponse: ErrorResponse = {
        errorTitle: 'Ошибка про проверке токена',
        errorSubtitle: JSON.stringify(err)
      };
      res.status(500).json(errorResponse);
      // res.status(500).send(`User token verification failed ${JSON.stringify(err)}`);
      return;
    }
  } else {
    const text = await res2.text();
    const errorResponse: ErrorResponse = {
      errorTitle: 'Пользователь не авторизован',
      errorSubtitle: text
    };
    res.status(res2.status).json(errorResponse);
  }
});

export const loginRouter = router;



