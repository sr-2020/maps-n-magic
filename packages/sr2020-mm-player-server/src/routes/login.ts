import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import { Ability, ErrorResponse, hasAbility, validateAuthRequest, validateTokenData, validateTokenRequestBody } from 'sr2020-mm-event-engine';
import { 
  playerServerConstants,
  createLogger,
  PlayerAuthorizedRequest,
  GetUserToken
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('login.ts');

const router = Router();

router.post('/api/login', async (req1, res) => {
  const req = req1 as PlayerAuthorizedRequest;
  // logger.info('/api/login', req.body);

  const authRequest = req.body;
  const { gameModel } = req;
  if (!validateAuthRequest(authRequest)) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Формат данных запроса некорректен',
      errorSubtitle: `Данные ${JSON.stringify(authRequest)}, ошибки ${JSON.stringify(validateAuthRequest.errors)}`
    };
    res.status(400).json(errorResponse);
    logger.info(`FAIL login ${JSON.stringify(errorResponse)}`);
    return;
  }

  const res2 = await gameModel.get2<GetUserToken>({
    type: 'userToken',
    login: authRequest.username,
    password: authRequest.password,
  });
  if (res2.status === 200) {
    const data = await res2.json();
    if (!validateTokenRequestBody(data)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Данные токена некорректны',
        errorSubtitle: `Данные ${JSON.stringify(data)}, ошибка ${JSON.stringify(validateTokenRequestBody.errors)}`
      };
      res.status(500).json(errorResponse);
      logger.info(`FAIL login ${authRequest.username} ${JSON.stringify(errorResponse)}`);
      return;
    }

    const { api_key } = data;

    try {
      const parsedToken = jwt.verify(api_key, playerServerConstants().JWT_SECRET);
      logger.info('parsedToken', parsedToken);
      if (!validateTokenData(parsedToken)) {
        const errorResponse: ErrorResponse = {
          errorTitle: 'Данные авторизации некорректны',
          errorSubtitle: `Данные ${JSON.stringify(parsedToken)}, ошибка ${JSON.stringify(validateTokenData.errors)}`
        };
        res.status(500).json(errorResponse);
        logger.info(`FAIL login ${authRequest.username} ${JSON.stringify(errorResponse)}`);
        return;
      }

      const data = await req.characterWatcher.getCharacterModel(parsedToken.modelId);

      if (!hasAbility(data, Ability.ArchMage)) {
        const errorResponse: ErrorResponse = {
          errorTitle: 'Вы не являетесь магом',
          errorSubtitle: ``
        };
        res.status(400).json(errorResponse);
        return;
      }

      res.cookie('mm_token', api_key, { httpOnly: true });
      res.json(parsedToken);
    } catch (err) {
      logger.info('User token verification failed', err);
      const errorResponse: ErrorResponse = {
        errorTitle: 'Ошибка про проверке токена',
        errorSubtitle: JSON.stringify(err)
      };
      res.status(500).json(errorResponse);
      logger.info(`FAIL login ${authRequest.username} ${JSON.stringify(errorResponse)}`);
      return;
    }
  } else {
    const text = await res2.text();
    const errorResponse: ErrorResponse = {
      errorTitle: 'Пользователь не авторизован',
      errorSubtitle: text
    };
    res.status(res2.status).json(errorResponse);
    logger.info(`FAIL login ${authRequest.username} ${JSON.stringify(errorResponse)}`);
  }
});

export const loginRouter = router;



