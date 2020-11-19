export const beaconsUrl = 'https://position.evarun.ru/api/v1/beacons';
export const locationsUrl = 'https://position.evarun.ru/api/v1/locations';
export const usersUrl = 'https://position.evarun.ru/api/v1/users';
export const positionUrl = 'https://position.evarun.ru/api/v1/positions';
export const manaOceanConfigUrl = 'https://gateway.evarun.ru/api/v1/config/manaOceanConfig';
export const manaOceanEffectConfigUrl = 'https://gateway.evarun.ru/api/v1/config/manaOceaEffectConfig';
export const billingInsurance = 'https://billing.evarun.ru/insurance/getinsurance';
export const pushServiceUrl = 'https://push.evarun.ru/send_notification';

// // /api/v1/users/{id}
// const url = 'https://position.evarun.ru/api/v1/users';
// const locationUrl = 'https://position.evarun.ru/api/v1/locations';

export const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: 0,
  lng: 0,
};

// duplicated in LocationRecordService
const defaultLocationStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

export const defaultLocationRecord = {
  label: '',
  created_at: null,
  updated_at: null,
  polygon: [],
  options: {
    ...defaultLocationStyleOptions,
  },
  layer_id: 1,
};

export const defaultManaOceanSettings = {
  minManaLevel: 1,
  neutralManaLevel: 4,
  maxManaLevel: 7,
  visibleMoonPeriod: 180, // minutes
  visibleMoonNewMoonTime: 0,
  visibleMoonManaTideHeight: 1,
  invisibleMoonPeriod: 270,
  invisibleMoonNewMoonTime: 120,
  invisibleMoonManaTideHeight: 1,
  moscowTime: 0,
};

export const manaOceanEffectSettings = {
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
