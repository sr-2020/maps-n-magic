import { UserService } from './services/UserService';
import { BotService } from './services/BotService/BotService';
import { TickerService } from './services/TickerService';
import { SpiritService } from './services/SpiritService';
import { SoundService2 } from './services/SoundService2';
import { SoundStageService } from './services/SoundStageService';
import { BeaconService } from './services/BeaconService';
import { LocationService } from './services/LocationService';
import { LocationRecordService } from './services/LocationRecordService';
import { SoundMappingService } from './services/SoundMappingService';
import { UserWatcher } from './services/UserWatcher';
import { BaseVersion } from './services/BaseVersion';
import { BeaconRecordService } from './services/BeaconRecordService';
import { NotificationService } from './services/NotificationService';
import { BackgroundImageService } from './services/BackgroundImageService';
import { CharacterHealthStateService } from './services/CharacterHealthStateService';
import { UserRecordService } from './services/UserRecordService';

export const services = [
  UserService,
  BotService,
  TickerService,
  SpiritService,
  SoundService2,
  SoundStageService,
  BeaconService,
  LocationService,
  LocationRecordService,
  SoundMappingService,
  UserWatcher,
  BaseVersion,
  BeaconRecordService,
  NotificationService,
  BackgroundImageService,
  CharacterHealthStateService,
  UserRecordService,
];
