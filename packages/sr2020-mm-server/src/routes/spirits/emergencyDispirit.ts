import * as R from 'ramda';
import { 
  EPutSpiritRequested, 
  ErrorResponse, 
  GetSpirits, 
  SuitedState, 
} from 'sr2020-mm-event-engine';
import { 
  createLogger, 
  EndpointId, 
  EndpointLogger, 
  InnerApiRequest, 
  PutSpiritRequestedCall, 
  ZeroSpiritAbilities, 
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('emergencyDispirit.ts');

export const mainEmergencyDispirit = async (req1, res, next) => {
  const req = req1 as InnerApiRequest;
  const { gameModel, body } = req;
  const eLogger = new EndpointLogger(gameModel, logger, EndpointId.EMERGENCY_DISPIRIT);
  try {
    // logger.info('mainEmergencyDispirit')
    eLogger.attempt(body);

    const { characterId } = body as { characterId: number };
    eLogger.setCharacterId(characterId);

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
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    const state = spirit.state as SuitedState; 
    if (state.status === 'Suited' && state.suitStatus !== 'normal') {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Абилки духа уже были сняты',
        errorSubtitle: JSON.stringify(body)
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    await gameModel.execute2<ZeroSpiritAbilities>({
      type: 'zeroSpiritAbilities',
      characterId
    });

    await (req.gameModel as unknown as PutSpiritRequestedCall).putSpiritRequested({
      id: spirit.id,
      props: {
        state: {
          ...state,
          suitStatus: 'emergencyDispirited',
          suitStatusChangeTime: Date.now()
        },
      }
    })

    // req.gameModel.emit2<EPutSpiritRequested>({
    //   type: 'putSpiritRequested',
    //   id: spirit.id,
    //   props: {
    //     state: {
    //       ...state,
    //       suitStatus: 'emergencyDispirited',
    //       suitStatusChangeTime: Date.now()
    //     },
    //   }
    // });

    eLogger.success(
      `has emergency dispirit ${spirit.id} ${spirit.name}`,
      `Дух ${spirit.id} ${spirit.name} уничтожен`
    );

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
