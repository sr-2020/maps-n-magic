import { 
  ErrorResponse, GetSpirits, isFullSpiritJar, PutSpiritArgs, SpiritConsistencyResponse, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  MainAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/moveSpiritsToAstral.ts');

export const mainMoveSpiritsToAstral = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  const { gameModel } = req;

  const spiritIds = req.body as number[];

  try {

    const updates: PutSpiritArgs[] = spiritIds.map(id => ({
      id,
      props: {
        state: {
          status: 'RestInAstral'
        }
      }
    }));

    gameModel.emit2({
      type: 'putSpiritsRequested',
      updates
    });

    setTimeout(() => {
      res.status(200).json({});
    }, 3000);

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