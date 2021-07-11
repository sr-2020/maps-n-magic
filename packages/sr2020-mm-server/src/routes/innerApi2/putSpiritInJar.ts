import * as R from 'ramda';
import { 
  ErrorResponse, 
  GetSpirit, 
  getSpiritLocationId, 
  GetUserRecord, 
  invalidRequestBody, 
  validateCatchSpiritInternalRequest,
  PutSpiritInJarRequestBody,
  validatePutSpiritInJarRequestBody
} from 'sr2020-mm-event-engine';
import { createLogger, getQrModelData, InnerApiRequest } from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";

const logger = createLogger('putSpiritInJar.ts');

export const putSpiritInJar = async (req1: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('putSpiritInJar')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    // const { characterId } = body as { characterId: number };

    // const spirits = req.gameModel.get2<GetSpirits>({
    //   type: 'spirits'
    // });

    // const spirit = spirits.find(spirit => {
    //   const { state } = spirit;
    //   return state.status === 'Suited' && state.characterId === characterId;
    // });

    // if (spirit === undefined) {
    //   const errorResponse: ErrorResponse = { 
    //     errorTitle: 'Не найден носимый дух',
    //     errorSubtitle: JSON.stringify(body)
    //   };
    //   res.status(400).json(errorResponse);
    //   return;
    // }

    // const state = spirit.state as SuitedState; 
    // if (state.status === 'Suited' && state.emergencyDispirited) {
    //   const errorResponse: ErrorResponse = { 
    //     errorTitle: 'Абилки духа уже были сняты',
    //     errorSubtitle: JSON.stringify(body)
    //   };
    //   res.status(400).json(errorResponse);
    //   return;
    // }

    // await zeroSpiritAbilities(characterId);

    // req.gameModel.emit2<EPutSpiritRequested>({
    //   type: 'putSpiritRequested',
    //   id: spirit.id,
    //   props: {
    //     state: {
    //       ...state,
    //       emergencyDispirited: true
    //     },
    //   }
    // });

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