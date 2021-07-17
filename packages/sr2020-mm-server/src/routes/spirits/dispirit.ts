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
  validateSuitSpiritInternalRequest,
  consequenceStatus,
  SpiritState
} from 'sr2020-mm-event-engine';
import { 
  clinicalDeath,
  clinicalDeathCombo,
  createLogger, 
  dispirit, 
  freeSpiritFromStorage, 
  getQrModelData, 
  InnerApiRequest, 
  putSpiritInStorage, 
  suitSpirit, 
  validateBodyStorageQrModelData, 
  validateSpiritJarQrModelData, 
  wound
} from 'sr2020-mm-server-event-engine';
import shortid from 'shortid';

const logger = createLogger('dispirit.ts');

export const mainDispirit = async (req1, res, next) => {
  const uid = shortid.generate();
  try {
    // logger.info('mainDispirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    logger.info(`DISPIRIT_ATTEMPT ${uid} data ${JSON.stringify(body)}`);

    if (!validateDispiritInternalRequest(body)) {
      const errorResponse = invalidRequestBody(body, validateDispiritInternalRequest.errors);
      res.status(400).json(errorResponse);
      logger.info(`DISPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
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
      logger.info(`DISPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    const { state } = spirit;

    if (state.status !== 'Suited') {
      // should never happen
      throw new Error(`${uid} Spirit state status is not Suited`);
    }

    const userRecord = req.gameModel.get2<GetUserRecord>({
      type: 'userRecord',
      id: characterId
    });

    if (userRecord === undefined) {
      // should never happen
      throw new Error(`${uid} not found user record for character ${characterId}`);
    }

    const shouldSaveSpiritInJar = spiritJarId !== null && state.suitStatus === 'normal';

    let newSpiritState: SpiritState;

    if (shouldSaveSpiritInJar) {
      const res2 = await dispirit(characterId, bodyStorageId, spiritJarId);
      newSpiritState = {
        status: 'InJar',
        // @ts-ignore
        qrId: spiritJarId
      };
    } else {
      const res2 = await dispirit(characterId, bodyStorageId, null);
      if (state.suitStatus === 'emergencyDispirited') {
        newSpiritState = {
          status: 'DoHeal',
          healStartTime: Date.now()
        };
      } else {
        newSpiritState = {
          status: 'RestInAstral',
        };
      }
    }

    req.gameModel.emit2<EPutSpiritRequested>({
      type: 'putSpiritRequested',
      id: spirit.id,
      props: {
        state: newSpiritState,
      }
    });

    let consequenceStatus: consequenceStatus = 'noConsequences';
    if (state.suitStatus !== 'normal') {
      const dateNow = Date.now();
      const { suitStatusChangeTime } = state;
      if (dateNow < (suitStatusChangeTime + 10 * 60 * 1000)) {
        consequenceStatus = 'woundConsequence';
      } else {
        consequenceStatus = 'deathConsequence';
        // spirit state processing forces clinical death so this code should not work
        // const res4 = await clinicalDeathCombo(characterId, userRecord.location_id);
      }
    }

    logger.info(`DISPIRIT_SUCCESS ${uid} Character ${characterId} dispirit ${spirit.id} ${spirit.name}, consequenceStatus ${consequenceStatus}`);

    res.status(200).json(consequenceStatus);
  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    logger.info(`DISPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
    return;
  }
}
