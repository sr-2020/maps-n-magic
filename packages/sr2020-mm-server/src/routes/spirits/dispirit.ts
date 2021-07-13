import * as R from 'ramda';
import { 
  EPutSpiritRequested, 
  ErrorResponse, 
  GetSpirit, 
  getSpiritLocationId, 
  GetSpirits, 
  GetUserRecord, 
  invalidRequestBody, 
  isEmptySpiritJar, 
  isFullBodyStorage, 
  isFullSpiritJar, 
  validateCatchSpiritInternalRequest, 
  validateDispiritInternalRequest, 
  validateSuitSpiritInternalRequest 
} from 'sr2020-mm-event-engine';
import { 
  createLogger, 
  dispirit, 
  freeSpiritFromStorage, 
  getQrModelData, 
  InnerApiRequest, 
  putSpiritInStorage, 
  suitSpirit, 
  validateBodyStorageQrModelData, 
  validateSpiritJarQrModelData 
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('dispirit.ts');

export const mainDispirit = async (req1, res, next) => {
  try {
    // logger.info('mainDispirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    if (!validateDispiritInternalRequest(body)) {
      res.status(400).json(invalidRequestBody(body, validateDispiritInternalRequest.errors));
      return;
    }

    const { characterId, spiritJarId, bodyStorageId } = body;

    // // copied from player-server isSpiritJarValid

    // const qrModelData1 = await getQrModelData(spiritJarId);
    // // const qrModelData = await getQrModelData(qrId + 1000000);

    // const validationRes1 = validateSpiritJarQrModelData(qrModelData1);

    // if ('errorTitle' in validationRes1) {
    //   res.status(500).json(validationRes1);
    //   return;
    // }

    // if (isEmptySpiritJar(validationRes1)) {
    //   const errorResponse: ErrorResponse = { 
    //     errorTitle: 'Духохранилище пусто',
    //     errorSubtitle: '' 
    //   };
    //   res.status(400).json(errorResponse);
    //   return;
    // }

    // const { spiritId } = validationRes1.workModel.data;

    // const spirit = req.gameModel.get2<GetSpirit>({
    //   type:'spirit',
    //   id: Number(spiritId)
    // });

    // if (spirit === undefined) {
    //   const errorResponse: ErrorResponse = { 
    //     errorTitle: `Дух ${spiritId} не найден`,
    //     errorSubtitle: '' 
    //   };
    //   res.status(400).json(errorResponse);
    //   return;
    // }

    // // copied from player-server isBodyStorageValid

    // const qrModelData = await getQrModelData(bodyStorageId);
    // // const qrModelData = await getQrModelData(qrId + 1000000);

    // const validationRes = validateBodyStorageQrModelData(qrModelData);

    // if ('errorTitle' in validationRes) {
    //   res.status(500).json(validationRes);
    //   return;
    // }

    // if (isFullBodyStorage(validationRes)) {
    //   const errorResponse: ErrorResponse = { 
    //     errorTitle: 'Телохранилище занято',
    //     errorSubtitle: '' 
    //   };
    //   res.status(400).json(errorResponse);
    //   return;
    // }

    // const res2 = await suitSpirit(characterId, {
    //   "name": spirit.name,
    //   "hp": spirit.hitPoints,
    //   "abilityIds": ["fireball"],
    // }, bodyStorageId, spiritJarId);

    const spirits = req.gameModel.get2<GetSpirits>({
      type: 'spirits'
    });

    const spirit = spirits.find(spirit => {
      const { state } = spirit;
      return state.status === 'Suited' && state.characterId === characterId;
    });

    if (spirit === undefined) {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Не найден носимый дух',
        errorSubtitle: JSON.stringify(body)
      };
      res.status(400).json(errorResponse);
      return;
    }

    const res2 = await dispirit(characterId, bodyStorageId, spiritJarId);

    if (spiritJarId !== null) {
      req.gameModel.emit2<EPutSpiritRequested>({
        type: 'putSpiritRequested',
        id: spirit.id,
        props: {
          state: {
            status: 'InJar',
            qrId: spiritJarId
          },
        }
      });
    } else {
      req.gameModel.emit2<EPutSpiritRequested>({
        type: 'putSpiritRequested',
        id: spirit.id,
        props: {
          state: {
            status: 'RestInAstral',
          },
        }
      });
    }

    logger.info(`Character ${characterId} dispirit ${spirit.id} ${spirit.name}`);

    res.status(200).json(true);
  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    return;
  }
}
