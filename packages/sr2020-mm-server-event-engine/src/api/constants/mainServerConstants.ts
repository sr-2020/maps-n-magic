import assert from "assert";

interface MainServerConstants {
  beaconsUrl: string;
  locationsUrl: string;
  usersUrl: string;
  positionUrl: string;
  billingInsurance: string;
  pushServiceUrl: string;
  featuresUrl: string;
};

let constantsInstance: MainServerConstants | null = null;

export function mainServerConstants(): MainServerConstants {
  if (constantsInstance === null) {
    const POSITION_URL = process.env.POSITION_URL;
    const BILLING_URL = process.env.BILLING_URL;
    const PUSH_URL = process.env.PUSH_URL;
    const MODEL_ENGINE_URL = process.env.MODEL_ENGINE_URL;
    
    assert(POSITION_URL != null, "POSITION_URL is not specified");
    assert(BILLING_URL != null, "BILLING_URL is not specified");
    assert(PUSH_URL != null, "PUSH_URL is not specified");
    assert(MODEL_ENGINE_URL != null, "MODEL_ENGINE_URL is not specified");
    
    console.log("MainServerConstants", { 
      POSITION_URL, 
      BILLING_URL, 
      PUSH_URL,
      MODEL_ENGINE_URL
    });
    
    constantsInstance = {
      beaconsUrl:   POSITION_URL + '/api/v1/beacons',
      locationsUrl: POSITION_URL + '/api/v1/locations',
      usersUrl:     POSITION_URL + '/api/v1/users',
      positionUrl:  POSITION_URL + '/api/v1/positions',
      billingInsurance: BILLING_URL + '/insurance/getinsurance',
      pushServiceUrl: PUSH_URL + '/send_notification',
      featuresUrl: MODEL_ENGINE_URL + '/features',
    }
  }
  assert(constantsInstance !== null);
  return constantsInstance;
}


// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';