import { DispiritInternalRequest, SuitSpiritInternalRequest } from "sr2020-mm-event-engine";
import { createLogger, playerServerConstants } from "sr2020-mm-server-event-engine";
import { playerServerCookie } from "./utils";

const logger = createLogger('testSuitDispirit.ts');

export function testSuitDispirit() {
  // setTimeout(innerTestSuitDispirit, 10000);
}


// characterId, bodyStorageId, spiritJarId
const items: [number, number, number][] = [
  [51935, 367, 359],
  [37231, 2001, 2000],
  [37264, 2003, 2002],
  [37289, 2005, 2004],
  [37312, 2007, 2006],
  [37313, 2009, 2008],
  [37317, 2011, 2010],
  [37425, 2013, 2012],
  [37428, 2015, 2014],
  [37432, 2017, 2016],
  [41410, 2019, 2018],
];

async function innerTestSuitDispirit() {
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
        }, 500 + Math.random() * 1000)
      })
    })
  );
}

async function singleCharacterTest(
  characterId: number,
  bodyStorageId: number,
  spiritJarId: number,
) {

  for (let i = 0; i < 5; i++) {
  // for (let i = 0; i < 3; i++) {
  // for (let i = 0; i < 1; i++) {
    const reqBody: SuitSpiritInternalRequest = {
      "characterId":characterId,
      "bodyStorageId":bodyStorageId,
      "spiritJarId":spiritJarId,
      "suitDuration":1800000
    };
  
    const suitSpiritRes = await fetch(playerServerConstants().suitSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });
  
    logger.info(`${i} suit up charcater ${characterId} in jar ${spiritJarId} bodyStorageId ${bodyStorageId}`);
  
    const reqBody2: DispiritInternalRequest = {
      "characterId":characterId,
      "bodyStorageId":bodyStorageId,
      "spiritJarId":spiritJarId,
      "messageBody":""
    };
  
    const dispiritRes = await fetch(playerServerConstants().dispiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody2)
    });
  
    logger.info(`${i} dispirit charcater ${characterId} in jar ${spiritJarId} bodyStorageId ${bodyStorageId}`);
  }
}