import assert from "assert";
import { createLogger } from "../../logger";

const logger = createLogger('genericServerConstants');

interface GenericServerConstants {
  JWT_SECRET: string;
  loginUrl: string;
  characterModelUrl: string;
  qrModelUrl: string;
  manaOceanConfigUrl: string;
  manaOceanEffectConfigUrl: string;
  playerServerTokenPayload: string;
};

let constantsInstance: GenericServerConstants | null = null;

export function genericServerConstants(): GenericServerConstants {
  if (constantsInstance === null) {
    const GATEWAY_URL = process.env.GATEWAY_URL;
    const MODELS_MANAGER_URL = process.env.MODELS_MANAGER_URL;
    const JWT_SECRET = process.env.JWT_SECRET;

    assert(MODELS_MANAGER_URL != null, "MODELS_MANAGER_URL is not specified");
    assert(GATEWAY_URL != null, "GATEWAY_URL is not specified");
    assert(JWT_SECRET != null, "JWT_SECRET is not specified");
    
    logger.info("GenericServerConstants", { 
      MODELS_MANAGER_URL, 
      GATEWAY_URL, 
      JWT_SECRET: '<not empty>'
    });
    
    constantsInstance = {
      JWT_SECRET,
      loginUrl:                 GATEWAY_URL + '/api/v1/auth/login',
      manaOceanConfigUrl:       GATEWAY_URL + '/api/v1/config/manaOceanConfig',
      manaOceanEffectConfigUrl: GATEWAY_URL + '/api/v1/config/manaOceanEffectConfig',
      characterModelUrl: MODELS_MANAGER_URL + '/character/model',
      qrModelUrl: MODELS_MANAGER_URL + '/qr/model',
      playerServerTokenPayload: 'player-server'
    }
  }
  assert(constantsInstance !== null);
  return constantsInstance;
}

// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';