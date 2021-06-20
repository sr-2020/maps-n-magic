import assert from "assert";

interface Urls {
  beaconsUrl: string;
  locationsUrl: string;
  usersUrl: string;
  positionUrl: string;
  manaOceanConfigUrl: string;
  manaOceanEffectConfigUrl: string;
  billingInsurance: string;
  pushServiceUrl: string;
  featuresUrl: string;
};

let urlInstance: Urls | null = null;

export function urls(): Urls {
  if (urlInstance === null) {
    const POSITION_URL = process.env.POSITION_URL;
    const GATEWAY_URL = process.env.GATEWAY_URL;
    const BILLING_URL = process.env.BILLING_URL;
    const PUSH_URL = process.env.PUSH_URL;
    const MODEL_ENGINE_URL = process.env.MODEL_ENGINE_URL;
    
    assert(POSITION_URL != null, "POSITION_URL is not specified");
    assert(GATEWAY_URL != null, "GATEWAY_URL is not specified");
    assert(BILLING_URL != null, "BILLING_URL is not specified");
    assert(PUSH_URL != null, "PUSH_URL is not specified");
    assert(MODEL_ENGINE_URL != null, "MODEL_ENGINE_URL is not specified");
    
    console.log("base urls", { 
      POSITION_URL, 
      GATEWAY_URL, 
      BILLING_URL, 
      PUSH_URL,
      MODEL_ENGINE_URL
    });
    
    urlInstance = {
      beaconsUrl: POSITION_URL + '/api/v1/beacons',
      locationsUrl: POSITION_URL + '/api/v1/locations',
      usersUrl: POSITION_URL + '/api/v1/users',
      positionUrl: POSITION_URL + '/api/v1/positions',
      manaOceanConfigUrl: GATEWAY_URL + '/api/v1/config/manaOceanConfig',
      manaOceanEffectConfigUrl: GATEWAY_URL + '/api/v1/config/manaOceanEffectConfig',
      billingInsurance: BILLING_URL + '/insurance/getinsurance',
      pushServiceUrl: PUSH_URL + '/send_notification',
      featuresUrl: MODEL_ENGINE_URL + '/features',
    }
  }
  assert(urlInstance !== null);
  return urlInstance;
}


// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';