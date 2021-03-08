import { 
  SettingsData
} from "./index";

// Mana ocean settings

export interface ManaOceanSettingsData extends SettingsData {
  minManaLevel: number;
  neutralManaLevel: number;
  maxManaLevel: number;
  visibleMoonPeriod: number;
  visibleMoonNewMoonTime: number;
  visibleMoonManaTideHeight: number;
  invisibleMoonPeriod: number;
  invisibleMoonNewMoonTime: number;
  invisibleMoonManaTideHeight: number;
  // moscowTime: number;
};

export interface ManaOceanEffectSettingsData extends SettingsData {
  massacreDelay: number;
  massacreDuration: number;
  powerSpellBoundary: number;
  powerSpellDelay: number;
  powerSpellDuration: number;
  ritualMembersBoundary: number;
  ritualDelay: number;
  spellDurationItem: number;
  spellProbabilityPerPower: number;
  spellDurationPerPower: number;
}

export interface MoonProps {
  period: number;
  offset: number;
}

export interface TidePeriodProps {
  startTime: number;
  value: number;
  intervalDuration?: number;
};

// Mana ocean effects

export interface AbstractManaOceanEffect {
  id: string;
  start: number;
  manaLevelChange: number;
  locationId: number;
}

export interface RitualLocationEffect extends AbstractManaOceanEffect {
  type: 'ritualLocation',
  permanent: true;
  neighborId?: number;
}

export interface PowerSpellEffect extends AbstractManaOceanEffect {
  type: 'powerSpell';
  end: number;
}

export interface SpellEffect extends AbstractManaOceanEffect {
  type: 'inputStream' | 'outputStream',
  end: number;
  range: number[];
  prevNeighborIds?: number[];
}

export interface MassacreEffect extends AbstractManaOceanEffect {
  type: 'massacre';
  end: number;
}

export type ManaOceanEffect = 
  RitualLocationEffect | 
  PowerSpellEffect | 
  SpellEffect | 
  MassacreEffect;
