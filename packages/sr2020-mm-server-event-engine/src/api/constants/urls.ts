import assert from "assert";

const POSITION_URL = process.env.POSITION_URL;
const GATEWAY_URL = process.env.GATEWAY_URL;
const BILLING_URL = process.env.BILLING_URL;
const PUSH_URL = process.env.PUSH_URL;

assert(POSITION_URL != null, "POSITION_URL is not specified");
assert(GATEWAY_URL != null, "GATEWAY_URL is not specified");
assert(BILLING_URL != null, "BILLING_URL is not specified");
assert(PUSH_URL != null, "PUSH_URL is not specified");

console.log("base urls", { 
  POSITION_URL, 
  GATEWAY_URL, 
  BILLING_URL, 
  PUSH_URL 
});

export const beaconsUrl = POSITION_URL + '/api/v1/beacons';
export const locationsUrl = POSITION_URL + '/api/v1/locations';
export const usersUrl = POSITION_URL + '/api/v1/users';
export const positionUrl = POSITION_URL + '/api/v1/positions';
export const manaOceanConfigUrl = GATEWAY_URL + '/api/v1/config/manaOceanConfig';
export const manaOceanEffectConfigUrl = GATEWAY_URL + '/api/v1/config/manaOceanEffectConfig';
export const billingInsurance = BILLING_URL + '/insurance/getinsurance';
export const pushServiceUrl = PUSH_URL + '/send_notification';

// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';