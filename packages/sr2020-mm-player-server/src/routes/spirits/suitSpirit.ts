import { 
  ErrorResponse, 
  GetSpirit, 
  getSuitSpiritDurationItems, 
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
  validateSpiritJarQrModelData, 
  validateSuitSpiritRequestBody 
} from "sr2020-mm-server-event-engine";
import { decode, playerServerCookie } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('suitSpirit.ts');

const basicSuitTime = 30 * 60 * 1000;

export const suitSpirit = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { body, characterModelData } = req;
  if (!validateSuitSpiritRequestBody(body)) {
    res.status(400).json(invalidRequestBody(body, validateSuitSpiritRequestBody.errors));
    return;
  }

  const { spiritJarQrString, bodyStorageQrString } = body;

  try {
    const spiritJarQrData = decode(spiritJarQrString);
    const spiritJarId = Number(spiritJarQrData.payload);

    if (Number.isNaN(spiritJarId)) {
      res.status(400).json(qrIdIsNanError(spiritJarQrData.payload));
      return;
    }

    const bodyStorageQrData = decode(bodyStorageQrString);
    const bodyStorageId = Number(bodyStorageQrData.payload);

    if (Number.isNaN(bodyStorageId)) {
      res.status(400).json(qrIdIsNanError(bodyStorageQrData.payload));
      return;
    }
    
    const reqBody: SuitSpiritInternalRequest = {
      spiritJarId,
      bodyStorageId,
      characterId: req.userData.modelId,
      suitDuration: getSuitSpiritDurationItems(characterModelData) * basicSuitTime
      // suitDuration: 60000
    };

    const suitSpiritRes = await fetch(playerServerConstants().suitSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    const json = await suitSpiritRes.json();

    logger.info('suitSpiritRes json', json);

    if (suitSpiritRes.status === 200) {
      req.characterWatcher.forceUpdateCharacterModel(req.userData.modelId);
    }

    res.status(suitSpiritRes.status).json(json);

  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
}