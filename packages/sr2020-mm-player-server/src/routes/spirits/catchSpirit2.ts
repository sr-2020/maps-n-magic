import { CatchSpiritInternalRequest, ErrorResponse, GetSpirit, invalidRequestBody, validateCatchSpirit2RequestBody } from "sr2020-mm-event-engine";
import { 
  createLogger, 
  playerServerConstants, 
  validateSpiritJarQrModelData, 
  GetQrModelData, 
  ExpectedQr,
  refSpiritJarQrId,
  refSpiritId
} from "sr2020-mm-server-event-engine";
import { PlayerAuthorizedRequest } from "../../types";
import { decode, playerServerCookie } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('catchSpirit2.ts');

export const catchSpirit2 = async (req1, res, next) => {
  // logger.info('/catchSpirit2');
  const req = req1 as PlayerAuthorizedRequest;
  const { body, gameModel } = req;
  if (!validateCatchSpirit2RequestBody(body)) {
    res.status(400).json(invalidRequestBody(body, validateCatchSpirit2RequestBody.errors));
    return;
  }
  const { spiritJarQrString, spiritId } = body;
  try {
    const qrData = decode(spiritJarQrString);
    const qrId = Number(qrData.payload);

    if (Number.isNaN(qrId)) {
      res.status(400).json(qrIdIsNanError(qrData.payload));
      return;
    }

    const qrModelData1 = await gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId,
      expectedQr: ExpectedQr.anySpiritJar
    });

    const validationRes = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }

    const qrModelData = validationRes;

    const spirit = req.gameModel.get2<GetSpirit>({
      type: 'spirit',
      id: Number(spiritId)
    });

    if (spirit === undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Дух не найден',
        errorSubtitle: `Дух с id ${spiritId} не найден`
      };
      res.status(400).json(errorResponse);
      return;
    }

    // if (isFullSpiritJar(qrModelData)) {
    //   const { spiritId } = qrModelData.workModel.data;

    //   const spirit = req.gameModel.get2<GetSpirit>({
    //     type: 'spirit',
    //     id: Number(spiritId)
    //   });

    //   if (spirit === undefined) {
    //     // do nothing and proceed with catching
    //   } else {
    //     const { state } = spirit;
    //     if (state.status === 'InJar' && state.qrId === qrId) {
    //       const errorResponse: ErrorResponse = {
    //         errorTitle: 'Тотем содержит духа',
    //         errorSubtitle: `В тотеме уже находится дух ${spirit.name}`
    //       };
    //       res.status(400).json(errorResponse);
    //       return;
    //     }
    //   }
    // }

    const mocked = playerServerConstants().MOCKED;
    const reqBody: CatchSpiritInternalRequest = {
      qrId: mocked ? refSpiritJarQrId : qrId,
      spiritId: mocked ? refSpiritId : spiritId,
      characterId: req.userData.modelId
    };

    const catchSpiritRes = await fetch(playerServerConstants().catchSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    const json = await catchSpiritRes.json();

    logger.info('catchSpiritRes json', json);

    res.status(catchSpiritRes.status).json(json);
    // if()

    // const qrModelData = await catchSpirit(Number(qrId), spiritId);

    // const errorResponse = validateQrModelData(qrModelData);

    // if (errorResponse !== null) {
    //   res.status(500).json(errorResponse);
    //   return;
    // }

    // res.status(200).json(qrModelData);
    // res.status(200).json({status: 'success'});
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    const errorResponse: ErrorResponse = { 
      errorTitle: 'PS Непредвиденная ошибка ловли духа',
      errorSubtitle: message 
    };
    logger.error(errorResponse, error);
    res.status(500).json(errorResponse);
  }
}
