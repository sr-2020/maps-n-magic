import assert from "assert";

interface PlayerServerConstants {
  playerDataSseUrl: string;
  JWT_SECRET: string;
  loginUrl: string;
  characterModelUrl: string;
  qrModelUrl: string;
};

let constantsInstance: PlayerServerConstants | null = null;

export function playerServerConstants(): PlayerServerConstants {
  if (constantsInstance === null) {
    const GATEWAY_URL = process.env.GATEWAY_URL;
    const MODELS_MANAGER_URL = process.env.MODELS_MANAGER_URL;
    const MM_MASTER_SERVER_URL = process.env.MM_MASTER_SERVER_URL;
    const JWT_SECRET = process.env.JWT_SECRET;

    assert(MODELS_MANAGER_URL != null, "MODELS_MANAGER_URL is not specified");
    assert(GATEWAY_URL != null, "GATEWAY_URL is not specified");
    assert(MM_MASTER_SERVER_URL != null, "MM_MASTER_SERVER_URL is not specified");
    assert(JWT_SECRET != null, "JWT_SECRET is not specified");
    
    console.log("PlayerServerConstants", { 
      MODELS_MANAGER_URL, 
      GATEWAY_URL, 
      MM_MASTER_SERVER_URL, 
      JWT_SECRET: '<not empty>'
    });
    
    constantsInstance = {
      playerDataSseUrl: MM_MASTER_SERVER_URL + '/playerDataSse',
      JWT_SECRET,
      loginUrl: GATEWAY_URL + '/api/v1/auth/login',
      characterModelUrl: MODELS_MANAGER_URL + '/character/model',
      qrModelUrl: MODELS_MANAGER_URL + '/qr/model',
    }
  }
  assert(constantsInstance !== null);
  return constantsInstance;
}

// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';