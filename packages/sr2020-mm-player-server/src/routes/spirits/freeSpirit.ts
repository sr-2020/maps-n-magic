import { ErrorResponse, FreeSpiritInternalRequest, invalidRequestBody } from "sr2020-mm-event-engine";
import { createLogger, freeSpiritFromStorage, playerServerConstants, validateFreeSpiritRequestBody, validateQrModelData } from "sr2020-mm-server-event-engine";
import { playerServerCookie } from "../../utils";

const logger = createLogger('freeSpirit.ts');

export const freeSpirit = async (req, res, next) => {
  const { body } = req;
  if (!validateFreeSpiritRequestBody(body)) {
    res.status(400).json(invalidRequestBody(body, validateFreeSpiritRequestBody.errors));
    return;
  }
  const { qrId, reason } = body;
  try {
    const reqBody: FreeSpiritInternalRequest = {
      qrId,
      reason
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

    logger.info('catchSpiritRes json', json);

    res.status(freeSpiritRes.status).json(json);
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