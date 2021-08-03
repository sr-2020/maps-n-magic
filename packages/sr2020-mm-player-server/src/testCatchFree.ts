import { CatchSpiritInternalRequest, DispiritInternalRequest, FreeSpiritInternalRequest, SuitSpiritInternalRequest } from "sr2020-mm-event-engine";
import { createLogger, playerServerConstants } from "sr2020-mm-server-event-engine";
import { playerServerCookie } from "./utils";

const logger = createLogger('testCatchFree.ts');

export function testCatchFree() {
 // setTimeout(innerTestCatchFree, 10000);
}


// characterId, spiritJarId, spiritId
const items: [number, number, number][] = [
  [51935, 2000, 160],
  [51935, 2002, 162],
  [51935, 2004, 167],
  [51935, 2006, 166],
  [51935, 2008, 168],
  [51935, 2010, 169],
  [51935, 2012, 155],
  [51935, 2014, 171],
  [51935, 2016, 172],
  [51935, 2018, 173],
  [51935, 2020, 174],
  
  [51935, 2022, 175],
  [51935, 2024, 176],
  [51935, 2026, 177],
  [51935, 2028, 178],
  [51935, 2030, 179],
  [51935, 2032, 181],
  [51935, 2034, 180],
  [51935, 2036, 182],
  [51935, 2038, 183],
  [51935, 2040, 184],
];



async function innerTestCatchFree() {
  await Promise.all(
    items.map((arr) => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try{
            await singleCharacterTest(...arr);
          } catch(err) {
            reject(err);
          }
          resolve('finished');
        }, 500 + Math.random() * 0)
      })
    })
  );
}

// characterId, spiritJarId, spiritId

async function singleCharacterTest(
  characterId: number,
  spiritJarId: number,
  spiritId: number,
) {
  for (let i = 0; i < 5; i++) {
  // for (let i = 0; i < 3; i++) {
  // for (let i = 0; i < 1; i++) {
    const reqBody2: FreeSpiritInternalRequest = {
      qrId: spiritJarId,
      reason: '',
      characterId,
      messageBody: ''
    };

    const freeSpiritRes = await fetch(playerServerConstants().freeSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody2)
    });
  
    logger.info(`${i} character ${characterId} freed spiritId ${spiritId} from jar ${spiritJarId}`);
    
    const reqBody: CatchSpiritInternalRequest = {
      qrId: spiritJarId,
      spiritId,
      characterId
    };

    const catchSpiritRes = await fetch(playerServerConstants().catchSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });
  
    logger.info(`${i} character ${characterId} cought spiritId ${spiritId} in jar ${spiritJarId}`);
  
  }
}