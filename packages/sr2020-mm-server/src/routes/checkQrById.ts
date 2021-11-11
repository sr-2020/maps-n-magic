import { 
  BodyStorageQr,
  ErrorResponse, 
  FullBodyStorageQr, 
  GameModel, 
  GetSpirit, 
  GetSpirits, 
  isEmptyBodyStorage, 
  isEmptySpiritJar, 
  isFullBodyStorage, 
  SpiritJarQr, 
  SuitedState, 
  validateBodyStorageQr, 
  validateCommonQr, 
  validateSpiritJarQr, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  ExpectedQr, 
  GetQrModelData, 
  MainAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/checkQrById.ts');

export const mainCheckQrById = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  const { gameModel } = req;

  try {

    const qrId = Number(req.params.qrId);

    if (Number.isNaN(qrId)) {
      throw new Error(`qrId ${req.params.qrId} is NaN`);
    }

    const qrModelData1 = await gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId,
      expectedQr: ExpectedQr.any
    });

    if (!validateCommonQr(qrModelData1)) {
      const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData1)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
      throw new Error(message);
    }

    if (validateSpiritJarQr(qrModelData1)) {
      res.status(200).json(analyzeSpiritJarQr(qrId, qrModelData1, gameModel));
      return;
    }

    if (validateBodyStorageQr(qrModelData1)) {
      res.status(200).json(analyzeBodyStorageQr(qrId, qrModelData1, gameModel));
      return;
    }
    
    res.status(200).json({
      type: 'unknownQrType',
      message: `Неизвестный тип куара ${qrModelData1.workModel.type}`
    });
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

export function analyzeBodyStorageQr(
  qrId: number, 
  qrModelData1: BodyStorageQr, 
  gameModel: GameModel
): { qrId: number; qrType: string; type: string; message: string; } {
  if (isEmptyBodyStorage(qrModelData1)) {
    return {
      qrId,
      qrType: 'bodyStorage',
      type: 'consistent',
      message: 'Телохранилище пусто'
    };
  }

  if (isFullBodyStorage(qrModelData1)) {
    const qrModelData = qrModelData1 as FullBodyStorageQr;
    const { characterId } = qrModelData.workModel.data.body;

    const spirits = gameModel.get2<GetSpirits>({
      type: 'spirits'
    });

    const suitedSpirits = spirits.filter(spirit => {
      const { state } = spirit;
      return state.status === 'Suited' && state.characterId === Number(characterId);
    });

    if (suitedSpirits.length === 0) {
      return {
        qrId,
        qrType: 'bodyStorage',
        type: 'bodyStorageIsNotEmpty_but_SpiritInNotSuited',
        message: `В телохранилище ${qrId} тело мага ${characterId}, но ни один дух на него не одет по версии океана`
      };
    }

    if (suitedSpirits.length > 1) {
      return {
        qrId,
        qrType: 'bodyStorage',
        type: 'bodyStorageIsNotEmpty_but_mageWearsMoreThanOneSpirit',
        message: `В телохранилище ${qrId} тело мага ${characterId}, и на мага надето более 1 духа ${JSON.stringify(suitedSpirits)}`
      };
    }

    const state = suitedSpirits[0].state as SuitedState;

    if (state.bodyStorageId !== qrId) {
      return {
        qrId,
        qrType: 'bodyStorage',
        type: 'bodyStorageIsNotEmpty_but_wearedSpiritExpectsOtherBodyStorage',
        message: `В телохранилище ${qrId} тело мага ${characterId}, и на мага надет дух ${state.spiritId} но тело мага ожидается в ${state.bodyStorageId}. State ${JSON.stringify(state)}`
      };
    }

    return {
      qrId,
      qrType: 'bodyStorage',
      type: 'consistent',
      message: `В телохранилище ${qrId} тело мага ${characterId}, одевшего духа ${state.spiritId} ожидающего тело в ${state.bodyStorageId}`
    };

  }

  return {
    qrId,
    qrType: 'bodyStorage',
    type: 'shouldNeverHappenBodyStorage',
    message: ''
  };
}


export function analyzeSpiritJarQr(
  qrId: number, 
  qrModelData1: SpiritJarQr, 
  gameModel: GameModel
): { qrId: number; qrType: string; type: string; message: string; } {
  if (isEmptySpiritJar(qrModelData1)) {
    return {
      qrId,
      qrType: 'spiritJar',
      type: 'consistent',
      message: 'Духохранилище пусто'
    };
  }

  const { spiritId } = qrModelData1.workModel.data;

  const spirit = gameModel.get2<GetSpirit>({
    type: 'spirit',
    id: Number(spiritId)
  });

  if (spirit === undefined) {
    return {
      qrId,
      qrType: 'spiritJar',
      type: 'spiritJarIsInconsistentWithOcean',
      message: `В куаре ${qrId} записан дух ${spiritId}, но такой дух не найден в океане`
    };
  }

  const { state } = spirit;
  if (state.status !== 'InJar') {
    return {
      qrId,
      qrType: 'spiritJar',
      type: 'spiritJarIsInconsistentWithOcean',
      message: `В куаре ${qrId} записан дух ${spiritId} ${spirit.name}, но по океану дух не в куаре. Состояние духа ${JSON.stringify(state)}`
    };
  }

  if (state.qrId !== qrId) {
    return {
      qrId,
      qrType: 'spiritJar',
      type: 'spiritJarIsInconsistentWithOcean',
      message: `В куаре ${qrId} записан дух ${spiritId} ${spirit.name}, но по океану дух в куаре ${state.qrId}`
    };
  }

  return {
    qrId,
    qrType: 'spiritJar',
    type: 'consistent',
    message: `В куаре ${qrId} записан дух ${spiritId} ${spirit.name} и в океане те же данные`
  };
}