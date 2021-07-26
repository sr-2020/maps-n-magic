import { GameModel, GetSpirit } from "sr2020-mm-event-engine";
import { createLogger } from "sr2020-mm-server-event-engine";

const logger = createLogger('routes/spirits/utils.ts');

export async function waitForSpiritSuited (
  type: string, 
  gameModel: GameModel, 
  spiritId: string | number
) {
  return 'finished';
}

export async function waitForSpiritSuited2 (
  type: string, 
  gameModel: GameModel, 
  spiritId: string | number
) {
  return new Promise<string>((resolve, reject) => {
    try {
      
      let checkTimeoutId: NodeJS.Timeout | null = null;
      let counter = 0;
      checkTimeoutId = setInterval(() => {
        const spirit = gameModel.get2<GetSpirit>({
          type:'spirit',
          id: Number(spiritId)
        });
        if (spirit === undefined) {
          if ( checkTimeoutId !== null ) {
            clearInterval(checkTimeoutId);
          }
          reject(new Error(`spirit undefined ${spiritId}`));
          return;
        }

        logger.info(`${type} ${counter} spirit ${spirit.id} status ${spirit.state.status}`);
        // if (spirit.state.status === 'Suited') {
        //   resolve('success')
        // } else {
        //   resolve('not success')
        // }
        // resolve('finished');
        counter++;
        // if (counter === 5) {
        if (counter === 3) {
        // if (counter === 1) {
          if ( checkTimeoutId !== null ) {
            clearInterval(checkTimeoutId);
          }
          resolve('finished');
        }

      }, 3000);
    } catch(err) {
      reject(err);
    }
  });
}