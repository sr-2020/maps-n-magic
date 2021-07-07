import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import { ErrorResponse, validateTokenData } from 'sr2020-mm-event-engine';
import { PlayerAuthorizedRequest, createLogger, playerServerConstants } from 'sr2020-mm-server-event-engine';

const logger = createLogger('parseUserData.ts');

const router = Router();

router.use(async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;

  const { characterWatcher } = req;

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
    const parsedToken = jwt.verify(mm_token, playerServerConstants().JWT_SECRET);
    // logger.info('parsedToken', parsedToken);
    if (!validateTokenData(parsedToken)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Данные авторизации некорректны',
        errorSubtitle: `Данные ${JSON.stringify(parsedToken)}, ошибки ${JSON.stringify(validateTokenData.errors)}`
      };
      res.status(500).json(errorResponse);
      return;
    }

    const data = await characterWatcher.getCharacterModel(parsedToken.modelId);
    req.userData = parsedToken;
    req.characterModelData = data;
    next();
  } catch (err) {
    logger.info('User token verification failed', err);
    const errorResponse: ErrorResponse = {
      errorTitle: 'Пользователь не авторизован',
      errorSubtitle: `Ошибка ${JSON.stringify(err)}`
    };
    res.status(500).json(errorResponse);
    return;
  }
});

router.get('/isLoggedIn', (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  logger.info('/api/isLoggedIn');
  // if we are here then parsing user data was successful
  res.status(200).json({
    userData: req.userData,
    characterModelData: req.characterModelData
  });
});


export const parseUserData = router;
