import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res,
} from '../../core';

import { GetLocationRecord } from "../../index";

import { 
  CharacterHealthStates, 
  RawCharacterHealthState,
  LocationRecord,
  CharacterHealthState
} from "../../types";

import { 
  chssMetadata,
  // PutCharHealth,
  // PutCharHealthConfirmed,
  // PutCharLocation,
  // PutCharLocationConfirmed,
  // SetCharacterHealthStates,
  GetCharacterHealthStates,
  GetCharacterHealthState,
  CharacterHealthStateEmitEvents,
  EPutCharLocationConfirmed,
  EPutCharHealthConfirmed,
  ESetCharacterHealthStates,
  CharacterHealthStateListenEvents,
  CharacterHealthStateServiceContract
} from "./types";

export * from './types';

export class CharacterHealthStateService extends AbstractService<
  CharacterHealthStateServiceContract
> {
  characterHealthStates: CharacterHealthStates;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(chssMetadata);
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
    this.putCharHealthConfirmed = this.putCharHealthConfirmed.bind(this);
    this.putCharLocationConfirmed = this.putCharLocationConfirmed.bind(this);
    this.setCharacterHealthStates = this.setCharacterHealthStates.bind(this);
  }

  init(): void {
    super.init();
    this.on2('putCharHealthConfirmed', this.putCharHealthConfirmed);
    this.on2('putCharLocationConfirmed', this.putCharLocationConfirmed);
    this.on2('setCharacterHealthStates', this.setCharacterHealthStates);
  }
  
  dispose(): void {
    this.off2('putCharHealthConfirmed', this.putCharHealthConfirmed);
    this.off2('putCharLocationConfirmed', this.putCharLocationConfirmed);
    this.off2('setCharacterHealthStates', this.setCharacterHealthStates);
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

  // putCharHealth(action: PutCharHealth): void {
  //   // this.emit('putCharHealthRequested', action);
  //   this.emit2({...action, type: 'putCharHealthRequested'});
  // }

  // putCharLocation(action: PutCharLocation) {
  //   // this.logger.info('putCharLocationRequested', action);
  //   // this.emit('putCharLocationRequested', action);
  //   this.emit2({...action, type: 'putCharLocationRequested'});
  // }

  getLocation(locationId: number): LocationRecord | null {
    return this.getFromModel2({
      type: 'locationRecord',
      id: locationId,
    });
  }

  putCharLocationConfirmed(action: EPutCharLocationConfirmed): void {
    const { characterId, locationId } = action;
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    const locationRecord = this.getLocation(locationId);
    // this.logger.info('putCharLocationConfirmed', action);
    // this.emit('putCharLocationConfirmed', {
    //   ...action,
    //   type: 'putCharLocationConfirmed',
    // });
    // this.emit2({...action, type: 'putCharLocationConfirmed'});
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

  putCharHealthConfirmed(action: EPutCharHealthConfirmed): void {
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

  setCharacterHealthStates({ characterHealthStates }: ESetCharacterHealthStates): void {
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
