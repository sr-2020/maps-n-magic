import * as R from 'ramda';
import { 
  BeaconRecord,
  LocationRecordOptions,
  LocationRecord,
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData
} from "sr2020-mm-event-engine";
import assert from "assert";

const POSITION_URL = process.env.POSITION_URL;
const GATEWAY_URL = process.env.GATEWAY_URL;
const BILLING_URL = process.env.BILLING_URL;
const PUSH_URL = process.env.PUSH_URL;

assert(POSITION_URL != null, "POSITION_URL is not specified");
assert(GATEWAY_URL != null, "GATEWAY_URL is not specified");
assert(BILLING_URL != null, "BILLING_URL is not specified");
assert(PUSH_URL != null, "PUSH_URL is not specified");

console.log("urls", POSITION_URL, GATEWAY_URL, BILLING_URL, PUSH_URL);

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

export const defaultBeaconRecord: Omit<BeaconRecord, 'id'> = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: 0,
  lng: 0,
};

// duplicated in LocationRecordService
const defaultLocationStyleOptions: LocationRecordOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
  manaLevel: 0,
  effectList: []
};

export const defaultLocationRecord: Omit<LocationRecord, 'id'> = {
  label: '',
  // created_at: null,
  // updated_at: null,
  polygon: [[]],
  options: {
    ...defaultLocationStyleOptions,
  },
  layer_id: 1,
};

export const defaultManaOceanSettings: ManaOceanSettingsData = {
  minManaLevel: 1,
  neutralManaLevel: 4,
  maxManaLevel: 7,
  visibleMoonPeriod: 180, // minutes
  visibleMoonNewMoonTime: 0,
  visibleMoonManaTideHeight: 1,
  invisibleMoonPeriod: 270,
  invisibleMoonNewMoonTime: 120,
  invisibleMoonManaTideHeight: 1,
  // moscowTime: 0,
};

export const manaOceanEffectSettings: ManaOceanEffectSettingsData = {
  massacreDelay: 60000 * 15,
  massacreDuration: 60000 * 30,
  // massacreDelay: 15000,
  // massacreDuration: 15000,
  // massacreDuration: 105000,
  powerSpellBoundary: 7,
  powerSpellDelay: 60000 * 15,
  powerSpellDuration: 60000 * 15,
  // powerSpellDelay: 15000,
  // powerSpellDuration: 15000,
  // powerSpellDuration: 105000,
  ritualMembersBoundary: 2,
  ritualDelay: 60000 * 15,
  // ritualDelay: 15000,
  spellDurationItem: 60000,
  // spellDurationItem: 6000,
  spellProbabilityPerPower: 20,
  spellDurationPerPower: 3,
};
