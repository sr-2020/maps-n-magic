import { 
  ErrorResponse, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  GetCharacterModelData, 
  GetUserLog,
  MainAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/getCharacterModelData.ts');

export const getCharacterModelData = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  try {
    const { gameModel } = req;
    const rows = await gameModel.get2<GetCharacterModelData>({
      type: 'characterModelData',
      modelId: Number(req.params.characterId)
    });
    res.status(200).json(rows);
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