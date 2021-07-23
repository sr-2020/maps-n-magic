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
  ConsequenceStatus,
  consequenceTexts,
  SpiritState
} from 'sr2020-mm-event-engine';
import { 
  createLogger, 
  dispirit, 
  freeSpiritFromStorage, 
  getQrModelData, 
  InnerApiRequest, 
  playerMessages, 
  putSpiritInStorage, 
  suitSpirit, 
  validateBodyStorageQrModelData, 
  validateSpiritJarQrModelData, 
  EndpointId, 
  EndpointLogger, 
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('dispirit.ts');

export const mainDispirit = async (req1, res, next) => {
  const eLogger = new EndpointLogger(logger, EndpointId.DISPIRIT);
  try {
    // logger.info('mainDispirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    eLogger.attempt(body);

    if (!validateDispiritInternalRequest(body)) {
      const errorResponse = invalidRequestBody(body, validateDispiritInternalRequest.errors);
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse);
      return;
    }

    const { characterId, spiritJarId, bodyStorageId, messageBody } = body;
    eLogger.setCharacterId(characterId);

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

    // logger.info(spirits);

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
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    const { state } = spirit;

    if (state.status !== 'Suited') {
      // should never happen
      throw new Error(`${eLogger.uid} Spirit state status is not Suited`);
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

    let consequenceStatus: ConsequenceStatus = 'noConsequences';
    if (state.suitStatus !== 'normal') {
      const dateNow = Date.now();
      const { suitStatusChangeTime } = state;
      if (dateNow < (suitStatusChangeTime + 10 * 60 * 1000)) {
        consequenceStatus = 'woundConsequence';
      } else {
        consequenceStatus = 'deathConsequence';
      }
    }

    if (messageBody !== '') {
      playerMessages(JSON.stringify({
        characterId,
        time: new Date(),
        messageBody
      }));
    }

    eLogger.success(
      `dispirit ${spirit.id} ${spirit.name}, consequenceStatus ${consequenceStatus}`,
      `Дух ${spirit.id} ${spirit.name} снят, последствия "${consequenceTexts[consequenceStatus]}"`
    );

    res.status(200).json(consequenceStatus);
  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    eLogger.fail(errorResponse, errorResponse.errorTitle);
    return;
  }
}
