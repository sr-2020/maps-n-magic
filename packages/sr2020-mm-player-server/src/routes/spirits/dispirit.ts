import { 
  DispiritInternalRequest,
  ErrorResponse, 
  GetSpirit, 
  invalidRequestBody, 
  isEmptySpiritJar, 
  isFullBodyStorage, 
  SpiritDataForQrValidation, 
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

const logger = createLogger('dispirit.ts');

export const dispirit = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { body } = req;
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

    const reqBody: DispiritInternalRequest = {
      spiritJarId,
      bodyStorageId,
      characterId: req.userData.modelId
    };

    const dispiritRes = await fetch(playerServerConstants().dispiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    const json = await dispiritRes.json();

    logger.info('dispiritRes json', json);

    if (dispiritRes.status === 200) {
      req.characterWatcher.forceUpdateCharacterModel(req.userData.modelId);
    }

    res.status(dispiritRes.status).json(json);

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