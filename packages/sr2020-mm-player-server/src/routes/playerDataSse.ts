import EventSource from "eventsource";

import { 
  EFeaturesChanged,
  ELocationRecordsChanged2, 
  ESetFeatures, 
  ESetSpiritFractions, 
  // ESetSpiritPhrases, 
  ESetSpirits, 
  ESpiritFractionsChanged, 
  // ESpiritPhrasesChanged, 
  ESpiritsChanged, 
  EUserRecordsChanged, 
  GameModel, 
  SetLocationRecords, 
  SetUserRecords 
} from 'sr2020-mm-event-engine';
import { createLogger, ECatcherStatesChanged, playerServerConstants, SetCatcherStates } from "sr2020-mm-server-event-engine";
import { playerServerCookie } from "../utils";

const logger = createLogger('playerDataSse.ts');

export function connectToMainServerSse(gameModel: GameModel): void {
  const es = new EventSource(playerServerConstants().playerDataSseUrl, {
    headers: {
      'Cookie': playerServerCookie
    }
  });
  
  // logger.info('main server es.readyState', es.readyState);
  
  es.onopen = function(event) {
    logger.info("EventSource onopen", event);
  };
  // es.onmessage = function(event) {
  //   logger.info("EventSource onmessage", event);
  // };
  es.onerror = function(event) {
    logger.info("EventSource onerror", event);
  };
  
  es.addEventListener('message', function (e) {
    try {
      const { data }: { data: string } = e;
      const parsedData: unknown = JSON.parse(data);
      if (isSpiritsChanged(parsedData)) {
        logger.info(parsedData.type);
        gameModel.emit2<ESetSpirits>({
          ...parsedData,
          type: 'setSpirits',
        });
      } else if (isSpiritFractionsChanged(parsedData)) {
        logger.info(parsedData.type);
        gameModel.emit2<ESetSpiritFractions>({
          ...parsedData,
          type: 'setSpiritFractions',
        });
      } else if(isLocationRecordsChanged(parsedData)) {
        logger.info(parsedData.type);
        gameModel.execute2<SetLocationRecords>({
          ...parsedData,
          type: 'setLocationRecords',
        });
      } else if(isUserRecordsChanged(parsedData)) {
        logger.info(parsedData.type);
        gameModel.execute2<SetUserRecords>({
          ...parsedData,
          type: 'setUserRecords',
        });
      } else if(isCatcherStatesChanged(parsedData)) {
        logger.info(parsedData.type);
        gameModel.execute2<SetCatcherStates>({
          ...parsedData,
          type: 'setCatcherStates',
        });
      } else if(isFeaturesChanged(parsedData)) {
        logger.info(parsedData.type);
        gameModel.emit2<ESetFeatures>({
          ...parsedData,
          type: 'setFeatures',
        });
      // } else if(isSpiritPhrasesChanged(parsedData)) {
      //   logger.info(parsedData.type);
      //   gameModel.emit2<ESetSpiritPhrases>({
      //     ...parsedData,
      //     type: 'setSpiritPhrases',
      //   });
      } else {
        logger.warn(`Unexpected sse message data ${JSON.stringify(e)}`);
      }
    } catch (err) {
      logger.error('error', err);
      logger.error(`Error on processing sse message: ${JSON.stringify(err)}, message ${JSON.stringify(e)}`)
    }
  })
}

const isSpiritsChanged = (obj: any): obj is ESpiritsChanged => {
  return obj.type === 'spiritsChanged';
}
const isSpiritFractionsChanged = (obj: any): obj is ESpiritFractionsChanged => {
  return obj.type === 'spiritFractionsChanged';
}
const isLocationRecordsChanged = (obj: any): obj is ELocationRecordsChanged2 => {
  return obj.type === 'locationRecordsChanged2';
}
const isUserRecordsChanged = (obj: any): obj is EUserRecordsChanged => {
  return obj.type === 'userRecordsChanged';
}
const isCatcherStatesChanged = (obj: any): obj is ECatcherStatesChanged => {
  return obj.type === 'catcherStatesChanged';
}
const isFeaturesChanged = (obj: any): obj is EFeaturesChanged => {
  return obj.type === 'featuresChanged';
}
// const isSpiritPhrasesChanged = (obj: any): obj is ESpiritPhrasesChanged => {
//   return obj.type === 'spiritPhrasesChanged';
// }