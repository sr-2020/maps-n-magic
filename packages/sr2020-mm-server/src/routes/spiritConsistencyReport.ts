import { 
  ErrorResponse, GetSpirits, isFullSpiritJar, SpiritConsistencyResponse, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  getQrModelData, 
  MainAuthorizedRequest, 
  mmGetUserLog, 
  PlayerAuthorizedRequest,
  validateSpiritJarQrModelData, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/spiritConsistencyReport.ts');

export const mainSpiritConsistencyReport = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  const { gameModel } = req;

  try {

    const spirits = gameModel.get2<GetSpirits>({
      type: 'spirits'
    });

    const inJarSpirits = spirits.filter(spirit => spirit.state.status === 'InJar');

    const promises = inJarSpirits.map(spirit => {
      const { state } = spirit;
      if (state.status !== 'InJar') {
        throw new Error('bam'); // should never happen
      }
      const { qrId } = state;
      // getSpirit

      return getQrModelData(qrId).then((qrModelData1): SpiritConsistencyResponse | null => {

        const validationRes = validateSpiritJarQrModelData(qrModelData1);
    
        if ('errorTitle' in validationRes) {
          // res.status(500).json(validationRes);
          // mmLog('SPIRIT_SELL_FAIL', `${uid} error ${JSON.stringify(validationRes)}`);
          return {
            type: 'qrIsNotSpiritJar',
            message: `qrId ${qrId} is not spirit jar`,
          };
        }
    
        const qrModelData = validationRes;

        if (isFullSpiritJar(qrModelData)) {
          const { spiritId } = qrModelData.workModel.data;
          if (Number(spiritId) === spirit.id) {
            return null;
          } else {
            return {
              type: 'spiritJarContainsOtherSpirit',
              message: `qrId ${qrId} contains spirit ${spiritId} but expected ${spirit.id}`,
            };
          }
        } else {
          return {
            type: 'spiritJarIsEmpty',
            message: `qrId ${qrId} is empty`,
          };
        }
        // qrModelData
      });
    });

    const errorResponses = await Promise.all(promises);

    const result = errorResponses.map((errorResponse, i) => ({
      errorResponse,
      spirit: inJarSpirits[i]
    })).filter(item => item.errorResponse !== null);

    // const rows = await mmGetUserLog(Number(req.params.characterId));
    res.status(200).json(result);
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