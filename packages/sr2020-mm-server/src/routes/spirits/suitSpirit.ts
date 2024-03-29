import * as R from 'ramda';
import { 
  EPutSpiritRequested, 
  ErrorResponse, 
  GameModel, 
  GetRandomSpiritPhrase, 
  GetSpirit, 
  getSpiritLocationId, 
  GetUserRecord, 
  invalidRequestBody, 
  isEmptySpiritJar, 
  isFullBodyStorage, 
  isFullSpiritJar, 
  validateCatchSpiritInternalRequest, 
  validateSuitSpiritInternalRequest 
} from 'sr2020-mm-event-engine';
import { 
  createLogger, 
  getSpiritWithFractionAbilities, 
  InnerApiRequest, 
  // suitSpirit, 
  translateAbilities, 
  validateBodyStorageQrModelData, 
  validateSpiritJarQrModelData,
  EndpointId, 
  EndpointLogger,
  PutSpiritRequestedCall,
  GetQrModelData,
  GetCharacterModelData,
  SuitSpirit,
  ExpectedQr, 
} from 'sr2020-mm-server-event-engine';
import { waitForSpiritSuited } from './utils';

const logger = createLogger('suitSpirit.ts');

export const mainSuitSpirit = async (req1, res, next) => {
  const req = req1 as InnerApiRequest;
  const { gameModel, body } = req;
  const eLogger = new EndpointLogger(gameModel, logger, EndpointId.SUIT_SPIRIT);
  try {
    // logger.info('mainSuitSpirit')
    eLogger.attempt(body);

    if (!validateSuitSpiritInternalRequest(body)) {
      const errorResponse = invalidRequestBody(body, validateSuitSpiritInternalRequest.errors);
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse);
      return;
    }

    const { characterId, spiritJarId, bodyStorageId, suitDuration } = body;
    eLogger.setCharacterId(characterId);

    // copied from player-server isSpiritJarValid

    const qrModelData1 = await gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId: spiritJarId,
      expectedQr: ExpectedQr.fullSpiritJar
    });

    const validationRes1 = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes1) {
      res.status(500).json(validationRes1);
      eLogger.fail(validationRes1);
      return;
    }

    if (isEmptySpiritJar(validationRes1)) {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Духохранилище пусто',
        errorSubtitle: '' 
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    const { spiritId } = validationRes1.workModel.data;

    const spirit = req.gameModel.get2<GetSpirit>({
      type:'spirit',
      id: Number(spiritId)
    });

    if (spirit === undefined) {
      const errorResponse: ErrorResponse = { 
        errorTitle: `Дух ${spiritId} не найден`,
        errorSubtitle: '' 
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    // copied from player-server isBodyStorageValid

    const qrModelData = await gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId: bodyStorageId,
      expectedQr: ExpectedQr.emptyBodyStorage
    });

    const validationRes = validateBodyStorageQrModelData(qrModelData);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      eLogger.fail(validationRes);
      return;
    }

    if (isFullBodyStorage(validationRes)) {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Телохранилище занято',
        errorSubtitle: '' 
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    const spirit2 = getSpiritWithFractionAbilities(req.gameModel, spirit);
    


    const message = req.gameModel.get2<GetRandomSpiritPhrase>({
      type: 'randomSpiritPhrase',
      characterId,
      spiritFractionId: spirit.fraction
    });

    const suitStartTime = Date.now();

    await (req.gameModel as unknown as PutSpiritRequestedCall).putSpiritRequested({
      id: spirit.id,
      props: {
        state: {
          status: 'Suited',
          spiritId: spirit.id,
          spiritName: spirit.name,
          characterId,
          suitStartTime,
          suitDuration,
          // duration: 2 * 60 * 1000, // 2 min
          suitStatus: 'normal',
          suitStatusChangeTime: -1,
          bodyStorageId,
          message
        },
      }
    })

    // req.gameModel.emit2<EPutSpiritRequested>({
    //   type: 'putSpiritRequested',
    //   id: spirit.id,
    //   props: {
    //     state: {
    //       status: 'Suited',
    //       spiritId: spirit.id,
    //       spiritName: spirit.name,
    //       characterId,
    //       suitStartTime,
    //       suitDuration,
    //       // duration: 2 * 60 * 1000, // 2 min
    //       suitStatus: 'normal',
    //       suitStatusChangeTime: -1,
    //       bodyStorageId,
    //       message
    //     },
    //   }
    // });

    const result = await waitForSpiritSuited('suitSpirit', req.gameModel, spiritId);

    const res2 = await gameModel.execute2<SuitSpirit>({
      type: 'suitSpirit',
      characterId, 
      spiritProps: {
        "name": spirit.name,
        "hp": spirit.hitPoints,
        // "abilityIds": ["fireball-keeper", "aurma"],
        "abilityIds": spirit2.abilities,
      }, 
      bodyStorageId, 
      spiritStorageId: spiritJarId
    });

    const characterData = await gameModel.get2<GetCharacterModelData>({
      type: 'characterModelData',
      modelId: characterId
    });

    const isInEctoplasmBody = characterData.workModel.currentBody === 'ectoplasm';
    logger.info(`Character ${characterId} isInEctoplasmBody ${isInEctoplasmBody}`);

    eLogger.success(`suit spirit ${spirit.id} ${spirit.name}, data ${JSON.stringify({
      suitStartTime,
      suitDuration
    })}`, `Дух ${spirit.id} ${spirit.name} надет на ${suitDuration / 60000} минут`);

    if (message !== null) {
      eLogger.success(
        `spirit ${spirit.id} ${spirit.name} says message "${message}"`, 
        `Дух ${spirit.id} ${spirit.name} передал мысль "${message}"`
      );
    }

    res.status(200).json(true);
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
