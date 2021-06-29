import assert from "assert";

interface PlayerServerConstants {
  playerDataSseUrl: string;
};

let constantsInstance: PlayerServerConstants | null = null;

export function playerServerConstants(): PlayerServerConstants {
  if (constantsInstance === null) {
    const MM_MASTER_SERVER_URL = process.env.MM_MASTER_SERVER_URL;

    assert(MM_MASTER_SERVER_URL != null, "MM_MASTER_SERVER_URL is not specified");
    
    console.log("PlayerServerConstants", { 
      MM_MASTER_SERVER_URL, 
    });
    
    constantsInstance = {
      playerDataSseUrl: MM_MASTER_SERVER_URL + '/playerDataSse',
    };
  }
  assert(constantsInstance !== null);
  return constantsInstance;
}

// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';