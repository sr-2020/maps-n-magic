import { ErrorResponse, FreeSpiritInternalRequest, invalidRequestBody } from "sr2020-mm-event-engine";
import { createLogger, freeSpiritFromStorage, PlayerAuthorizedRequest, playerServerConstants, validateFreeSpiritRequestBody, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";
import { playerServerCookie } from "../utils";

const logger = createLogger('loadHistory.ts');

export const loadHistory = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;

  try {
    const historyRes = await fetch(playerServerConstants().loadHistoryUrl + '/' + req.userData.modelId, {
      headers: {
        'Cookie': playerServerCookie,
      },
    });

    const json = await historyRes.json();

    if (historyRes.status !== 200) {
      logger.info(`Load history error, status ${historyRes.status}, data ${JSON.stringify(json)}`);
    }

    res.status(historyRes.status).json(json);
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