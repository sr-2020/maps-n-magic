import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res,
} from '../../core';

import { 
  CharacterHealthStates, 
  RawCharacterHealthState,
  LocationRecord,
  CharacterHealthState
} from "../../types";

import { 
  metadata,
  PutCharHealth,
  PutCharHealthConfirmed,
  PutCharLocation,
  PutCharLocationConfirmed,
  SetCharacterHealthStates,
  GetCharacterHealthStates,
  GetCharacterHealthState,
  CharacterHealthStateEvents
} from "./types";

export * from './types';

export class CharacterHealthStateService extends AbstractService<CharacterHealthStateEvents> {
  characterHealthStates: CharacterHealthStates;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    // {
    //   "51935": {
    //     "locationId": 3217,
    //     "locationLabel": "Мастерка",
    //     "healthState": "healthy",
    //     "timestamp": 1606410304241,
    //     "lifeStyle": "Wood",
    //     "personName": "Новый персонаж в группе Мастера и приложение !!!(Без страховки)!!!"
    //   }
    // }
    this.characterHealthStates = {};
  }

  // this is a virtual service without real persistence
  // eslint-disable-next-line class-methods-use-this
  // setData() {
  // }

  // eslint-disable-next-line class-methods-use-this
  // getData() {
  //   return {};
  // }

  getCharacterHealthStates(arg: Req<GetCharacterHealthStates>): Res<GetCharacterHealthStates> {
    return R.clone(this.characterHealthStates);
  }

  getCharacterHealthState({ id }: Req<GetCharacterHealthState>): Res<GetCharacterHealthState> {
    return R.clone(this.characterHealthStates[id]);
  }

  putCharHealth(action: PutCharHealth): void {
    // this.emit('putCharHealthRequested', action);
    this.emit2({...action, type: 'putCharHealthRequested'});
  }

  putCharLocation(action: PutCharLocation) {
    // this.logger.info('putCharLocationRequested', action);
    // this.emit('putCharLocationRequested', action);
    this.emit2({...action, type: 'putCharLocationRequested'});
  }

  getLocation(locationId: number): LocationRecord {
    return this.getFromModel<any, LocationRecord>({
      type: 'locationRecord',
      id: locationId,
    });
  }

  putCharLocationConfirmed(action: PutCharLocationConfirmed): void {
    const { characterId, locationId } = action;
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    const locationRecord = this.getLocation(locationId);
    // this.logger.info('putCharLocationConfirmed', action);
    // this.emit('putCharLocationConfirmed', {
    //   ...action,
    //   type: 'putCharLocationConfirmed',
    // });
    this.emit2({...action, type: 'putCharLocationConfirmed'});
    if (!prevCharacterHealthState || !locationRecord) {
      return;
    }
    const characterHealthState: RawCharacterHealthState = {
      ...prevCharacterHealthState,
      locationId,
      locationLabel: locationRecord.label,
    };
    this.characterHealthStates = {
      ...this.characterHealthStates,
      [characterId]: characterHealthState,
    };
    // this.emit('characterHealthStateChanged', {
    //   characterId,
    //   characterHealthState,
    //   type: 'characterHealthStateChanged',
    //   prevCharacterHealthState,
    // });
    this.emit2({
      type: 'characterHealthStateChanged',
      characterId,
      characterHealthState,
      prevCharacterHealthState,
    });
    // this.emit('characterHealthStatesLoaded', {
    //   type: 'characterHealthStatesLoaded',
    //   characterHealthStates: this.characterHealthStates,
    // });
    this.emit2({
      type: 'characterHealthStatesLoaded',
      characterHealthStates: this.characterHealthStates,
    });
  }

  putCharHealthConfirmed(action: PutCharHealthConfirmed): void {
    const { characterId, characterHealthState } = action;
    // console.log('putCharHealthConfirmed', characterId, characterHealthState);
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    // this.characterHealthStates[characterId] = characterHealthState;
    this.characterHealthStates = {
      ...this.characterHealthStates,
      [characterId]: characterHealthState,
    };
    // this.emit('characterHealthStateChanged', {
    //   ...action,
    //   type: 'characterHealthStateChanged',
    //   prevCharacterHealthState,
    // });
    this.emit2({
      ...action,
      type: 'characterHealthStateChanged',
      prevCharacterHealthState,
    });
    // this.emit('characterHealthStatesLoaded', {
    //   type: 'characterHealthStatesLoaded',
    //   characterHealthStates: this.characterHealthStates,
    // });
    this.emit2({
      type: 'characterHealthStatesLoaded',
      characterHealthStates: this.characterHealthStates,
    });
    // console.log({ characterId, characterHealthState, prevCharacterHealthState });
  }

  setCharacterHealthStates({ characterHealthStates }: SetCharacterHealthStates): void {
    // console.log('characterHealthStates', characterHealthStates);
    this.characterHealthStates = characterHealthStates;
    // this.emit('characterHealthStatesLoaded', {
    //   type: 'characterHealthStatesLoaded',
    //   characterHealthStates,
    // });
    this.emit2({
      type: 'characterHealthStatesLoaded',
      characterHealthStates,
    });
  }
}
