import { 
  ErrorResponse, 
  FreeSpiritInternalRequest, 
  invalidRequestBody 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  freeSpiritFromStorage, 
  PlayerAuthorizedRequest, 
  playerServerConstants, 
  validateFreeSpiritRequestBody, 
  validateSpiritJarQrModelData 
} from "sr2020-mm-server-event-engine";
import { playerServerCookie } from "../../utils";

const logger = createLogger('freeSpirit.ts');

export const freeSpirit = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { body } = req;
  if (!validateFreeSpiritRequestBody(body)) {
    res.status(400).json(invalidRequestBody(body, validateFreeSpiritRequestBody.errors));
    return;
  }
  const { qrId, reason, messageBody } = body;

  try {
    const reqBody: FreeSpiritInternalRequest = {
      qrId,
      reason,
      characterId: req.userData.modelId,
      messageBody
    };

    const freeSpiritRes = await fetch(playerServerConstants().freeSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    const json = await freeSpiritRes.json();

    if (freeSpiritRes.status !== 200) {
      logger.info(`Free spirit error, status ${freeSpiritRes.status}, data ${JSON.stringify(json)}`);
    }

    res.status(freeSpiritRes.status).json(json);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    const errorResponse: ErrorResponse = { 
      errorTitle: 'PS Непредвиденная ошибка освобождения духа',
      errorSubtitle: message 
    };
    logger.error(errorResponse, error);
    res.status(500).json(errorResponse);
  }
}