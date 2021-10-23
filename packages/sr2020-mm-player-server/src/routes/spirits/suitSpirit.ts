import { 
  ErrorResponse, 
  getSuitSpiritDurationItems, 
  invalidRequestBody, 
  SuitSpiritInternalRequest,
  validateSuitSpiritRequestBody
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  playerServerConstants, 
} from "sr2020-mm-server-event-engine";
import { PutCharacterMessage } from "../../gameModel/MessageService";
import { PlayerAuthorizedRequest } from "../../types";
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
      // setTimeout(() => {
      req.characterWatcher.forceUpdateCharacterModel(req.userData.modelId);
      // }, 30000);
    }

    req.gameModel.execute2<PutCharacterMessage>({
      type: 'putCharacterMessage',
      characterId: req.userData.modelId,
      data: {
        timestamp: Date.now(),
        message: ''
      }
    });

    res.status(suitSpiritRes.status).json(json);
    // const message = req.gameModel.get2<GetRandomSpiritPhrase>({
    //   type: 'randomSpiritPhrase'
    // });
    // res.status(suitSpiritRes.status).json(message);

  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    const errorResponse: ErrorResponse = { 
      errorTitle: 'PS Непредвиденная ошибка надевания духа',
      errorSubtitle: message 
    };
    logger.error(errorResponse, error);
    res.status(500).json(errorResponse);
  }
}