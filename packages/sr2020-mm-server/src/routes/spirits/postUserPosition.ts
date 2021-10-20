import { 
  ErrorResponse, 
  FreeSpiritInternalRequest, 
  invalidRequestBody 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  PlayerAuthorizedRequest, 
  EndpointId, 
  EndpointLogger,
  PostUserPosition, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('tmp/postUserPosition.ts');

export const mainPostUserPosition = async (req1, res, next) => {
  const eLogger = new EndpointLogger(logger, EndpointId.POST_USER_POSITION);
  const req = req1 as PlayerAuthorizedRequest;
  const { body, gameModel } = req;
  
  eLogger.attempt(body);
  const { characterId, ssid, locationName } = body;
  eLogger.setCharacterId(characterId);

  try {
    await gameModel.get2<PostUserPosition>({
      type: 'postUserPosition',
      characterId,
      ssid
    });
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