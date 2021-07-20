import * as R from 'ramda';
import { 
  EPutSpiritRequested, 
  ErrorResponse, 
  GetSpirits, 
  SuitedState, 
} from 'sr2020-mm-event-engine';
import { 
  createLogger, 
  InnerApiRequest, 
  mmLog, 
  zeroSpiritAbilities
} from 'sr2020-mm-server-event-engine';
import shortid from 'shortid';

const logger = createLogger('emergencyDispirit.ts');

export const mainEmergencyDispirit = async (req1, res, next) => {
  const uid = shortid.generate();
  try {
    // logger.info('mainEmergencyDispirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    logger.info(`EMERGENCY_DISPIRIT_ATTEMPT ${uid} data ${JSON.stringify(body)}`);
    mmLog('EMERGENCY_DISPIRIT_ATTEMPT', `${uid} data ${JSON.stringify(body)}`);

    const { characterId } = body as { characterId: number };

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
      logger.info(`EMERGENCY_DISPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('EMERGENCY_DISPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    const state = spirit.state as SuitedState; 
    if (state.status === 'Suited' && state.suitStatus !== 'normal') {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Абилки духа уже были сняты',
        errorSubtitle: JSON.stringify(body)
      };
      res.status(400).json(errorResponse);
      logger.info(`EMERGENCY_DISPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('EMERGENCY_DISPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    await zeroSpiritAbilities(characterId);

    req.gameModel.emit2<EPutSpiritRequested>({
      type: 'putSpiritRequested',
      id: spirit.id,
      props: {
        state: {
          ...state,
          suitStatus: 'emergencyDispirited',
          suitStatusChangeTime: Date.now()
        },
      }
    });

    logger.info(`EMERGENCY_DISPIRIT_SUCCESS ${uid} Character ${characterId} has emergency dispirit ${spirit.id} ${spirit.name}`);
    mmLog('EMERGENCY_DISPIRIT_SUCCESS', `${uid} Character ${characterId} has emergency dispirit ${spirit.id} ${spirit.name}`);

    res.status(200).json(true);
  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    logger.info(`EMERGENCY_DISPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
    mmLog('EMERGENCY_DISPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
    return;
  }
}
