import assert from "assert";
import { createLogger } from "../../logger";
import { getEnvVariables, getPrintObject, mergeEnvVariables } from "./envUtils";
import { GenericServerConstants, getGenericEnvVariables, getGenericServerConstants } from "./genericServerConstants";

const logger = createLogger('playerServerConstants.ts');

interface PlayerServerConstants extends GenericServerConstants {
  playerDataSseUrl: string;
  catchSpiritUrl: string;
};

let constantsInstance: PlayerServerConstants | null = null;

enum PlayerServerConstant {
  'MM_MASTER_SERVER_URL' = 'MM_MASTER_SERVER_URL',
}

export function playerServerConstants(): PlayerServerConstants {
  if (constantsInstance === null) {

    const playerEnvVariables = mergeEnvVariables(
      getGenericEnvVariables(),
      getEnvVariables(Object.values(PlayerServerConstant), [])
    );
    const { values } = playerEnvVariables;
    if (playerEnvVariables.missedValues.length > 0) {
      throw new Error(`Missed env params ${JSON.stringify(playerEnvVariables.missedValues)}`);
    }

    const printObject = getPrintObject(playerEnvVariables);

    logger.info("PlayerServerConstants", printObject);
    
    constantsInstance = {
      ...getGenericServerConstants(playerEnvVariables),
      playerDataSseUrl: values[PlayerServerConstant.MM_MASTER_SERVER_URL] + '/innerApi/playerDataSse',
      catchSpiritUrl: values[PlayerServerConstant.MM_MASTER_SERVER_URL] + '/innerApi/catchSpirit',
    };
  }
  assert(constantsInstance !== null);
  return constantsInstance;
}
