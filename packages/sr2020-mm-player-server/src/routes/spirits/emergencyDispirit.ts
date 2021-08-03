import { 
  DispiritInternalRequest,
  ErrorResponse, 
  GetSpirit, 
  invalidRequestBody, 
  isEmptySpiritJar, 
  isFullBodyStorage, 
  SuitSpiritInternalRequest
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  getQrModelData, 
  PlayerAuthorizedRequest, 
  playerServerConstants, 
  validateBodyStorageQrModelData, 
  validateDispiritRequestBody, 
  validateSpiritJarQrModelData, 
  validateSuitSpiritRequestBody 
} from "sr2020-mm-server-event-engine";
import { decode, playerServerCookie } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('emergencyDispirit.ts');

export const emergencyDispirit = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;

  try {
    const emergencyDispiritRes = await fetch(playerServerConstants().emergencyDispiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        characterId: req.userData.modelId
      })
    });

    const json = await emergencyDispiritRes.json();

    logger.info('emergencyDispiritRes json', json);

    if (emergencyDispiritRes.status === 200) {
      req.characterWatcher.forceUpdateCharacterModel(req.userData.modelId);
    }

    res.status(emergencyDispiritRes.status).json(json);

  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    const errorResponse: ErrorResponse = { 
      errorTitle: 'PS Непредвиденная ошибка снятия способностей',
      errorSubtitle: message 
    };
    logger.error(errorResponse, error);
    res.status(500).json(errorResponse);
  }
}