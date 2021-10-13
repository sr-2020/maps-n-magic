import { 
  BeaconRecord,
  LocationRecordOptions,
  LocationRecord,
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData
} from "sr2020-mm-event-engine";

export const defaultBeaconRecord: Omit<BeaconRecord, 'id'> = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: null,
  lng: null,
};

// duplicated in LocationRecordService
const defaultLocationStyleOptions: LocationRecordOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
  manaLevel: 4,
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
  massacreManaChange: 1,
  massacrePeopleLimit: 5,
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
