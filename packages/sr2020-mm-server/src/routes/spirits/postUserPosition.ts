import { 
  ErrorResponse, 
  FreeSpiritInternalRequest, 
  invalidRequestBody 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  freeSpiritFromStorage, 
  innerPostUserPosition2, 
  PlayerAuthorizedRequest, 
  playerServerConstants, 
  validateFreeSpiritRequestBody, 
  validateSpiritJarQrModelData 
} from "sr2020-mm-server-event-engine";

import { EndpointLogger, EndpointId } from './logUtils';

const logger = createLogger('tmp/postUserPosition.ts');

export const mainPostUserPosition = async (req1, res, next) => {
  const eLogger = new EndpointLogger(logger, EndpointId.POST_USER_POSITION);
  const req = req1 as PlayerAuthorizedRequest;
  const { body } = req;
  
  eLogger.attempt(body);
  const { characterId, ssid, locationName } = body;
  eLogger.setCharacterId(characterId);

  try {
    await innerPostUserPosition2(characterId, ssid);
    eLogger.success(`ssid ${ssid} locationName ${locationName}`, `Вы перешли в "${locationName}".`);
    res.sendStatus(200);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    eLogger.fail(errorResponse);
    res.status(500).json(errorResponse);
  }
}