import { ErrorResponse, FreeSpiritInternalRequest, invalidRequestBody } from "sr2020-mm-event-engine";
import { createLogger, freeSpiritFromStorage, innerPostUserPosition2, mmLog, PlayerAuthorizedRequest, playerServerConstants, validateFreeSpiritRequestBody, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";

const logger = createLogger('tmp/postUserPosition.ts');

export const mainPostUserPosition = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { body } = req;
  // if (!validateFreeSpiritRequestBody(body)) {
  //   res.status(400).json(invalidRequestBody(body, validateFreeSpiritRequestBody.errors));
  //   return;
  // }
  const { characterId, ssid } = body;

  try {
    await innerPostUserPosition2(characterId, ssid);
    logger.info('POST_USER_POSITION_SUCCESS', `characterId ${req.params.characterId}, ssid ${ssid}`);
    mmLog('POST_USER_POSITION_SUCCESS', `characterId ${req.params.characterId}, ssid ${ssid}`);
    res.sendStatus(200);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    logger.info('POST_USER_POSITION_SUCCESS', `characterId ${req.params.characterId}, ssid ${ssid}, error ${JSON.stringify(errorResponse)}`);
    mmLog('POST_USER_POSITION_SUCCESS', `characterId ${req.params.characterId}, ssid ${ssid}, error ${JSON.stringify(errorResponse)}`);
    res.status(500).json(errorResponse);
  }
}