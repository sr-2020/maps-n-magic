import * as R from 'ramda';
import { 
  Ability, 
  AbstractService, 
  ESpellCast, 
  GameModel, 
  GMLogger, 
  hasAbility, 
  Req, 
  Res, 
  ServiceContract, 
  ServiceContractTypes, 
  Spell, 
  Typed, 
  validateCharacterModelData,
  CatcherData, 
  CatcherStates 
} from 'sr2020-mm-event-engine';
import { getCharacterModelData } from '../api';
import { mmLog } from '../api/spirits/mmLog';
import { logCharacterAction } from '../utils';

export type CatcherStatesArg = {
  catcherStates: CatcherStates
};

// requests

export type GetCatcherStates = (arg: Typed<'catcherStates'>) => CatcherStates;
export type GetCatcherState = (arg: Typed<'catcherState', {
  id: string;
}>) => CatcherData | undefined;

// export type SetCatcherStateUpdates = Typed<'setCatcherStateUpdates', CatcherStatesArg>;
export type RemoveCatcherStates = (arg: Typed<'removeCatcherStates', {
  expiredStatesList: string[];
}>) => void;
export type DecrementAttempt = (arg: Typed<'decrementAttempt', {
  characterId: number;
}>) => void;
export type SetCatcherStates = (arg: Typed<'setCatcherStates', CatcherStatesArg>) => void;

// emit events

export type ECatcherStatesChanged = Typed<'catcherStatesChanged', CatcherStatesArg>;

// listen events

export interface SpiritCatcherServiceContract extends ServiceContract {
  Request: GetCatcherStates | GetCatcherState;
  Action: RemoveCatcherStates | DecrementAttempt | SetCatcherStates;
  EmitEvent: ECatcherStatesChanged;
  NeedAction: never;
  NeedRequest: never;
  ListenEvent: ESpellCast;
}

export const spiritCatcherMetadata: ServiceContractTypes<SpiritCatcherServiceContract> = {
  requests: ['catcherState', 'catcherStates'],
  actions: ['removeCatcherStates', 'decrementAttempt', 'setCatcherStates'],
  emitEvents: [
    'catcherStatesChanged',
  ],
  listenEvents: [
    'spellCast',
  ],
  needActions: [],
  needRequests: [],
};

export class SpiritCatcherService extends AbstractService<SpiritCatcherServiceContract> {
  catcherStates: CatcherStates;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritCatcherMetadata);
    this.catcherStates = {};
    this.onSpellCast = this.onSpellCast.bind(this);
    this.setCatcherStates = this.setCatcherStates.bind(this);
  }

  init() {
    super.init();
    this.on2('spellCast', this.onSpellCast);
    // setTimeout(() => {
    //   this.onSpellCast({
    //     type: 'spellCast',
    //     data: {
    //       characterId: '51935',
    //       id: Spell.SpiritCatcher,
    //       location: {id: 234},
    //       name: Spell.SpiritCatcher,
    //       // power: 2,
    //       power: 1,
    //       ritualMembersIds: [],
    //       ritualVictimIds: [],
    //       timestamp: Date.now()
    //     }
    //   })
    // }, 10000);
  }

  dispose() {
    this.off2('spellCast', this.onSpellCast);
  }

  async onSpellCast({ data }: ESpellCast): Promise<void> {
    if (data.id !== Spell.SpiritCatcher) {
      return;
    }

    const { characterId, power } = data;
    
    const characterData = await getCharacterModelData(Number(characterId));
    if (!validateCharacterModelData(characterData)) {
      this.logger.warn(`model ${characterId} is not valid. Model ${JSON.stringify(data)}, errors ${JSON.stringify(validateCharacterModelData.errors)}`);
    } else {
      // logger.info(`model ${modelId} is valid`);
    }

    const durationMillis = power * 5 * 60000;
    const hasSpiritFeed = hasAbility(characterData, Ability.SpiritFeed);
    const hasSpiritKnown = hasAbility(characterData, Ability.SpiritKnown);
    const catchProbability = Math.min(
      power * 20
      + (hasSpiritFeed ? 20 : 0)
      + (hasSpiritKnown ? 10 : 0),
      100
    );

    const catcherData: CatcherData = {
      startTime: Date.now(),
      durationMillis,
      catchProbability,
      attemptNumber: 3
    };
    this.catcherStates[characterId] = catcherData;
    
    logCharacterAction(
      this.logger,
      data.uid,
      'SPELL_CAST_SPIRIT_CATCHER',
      Number(data.characterId),
      `applied spirit catcher. catcher data ${JSON.stringify(catcherData)}, spell data ${JSON.stringify(data)}`,
      'Заклинание Spirit Catcher',
      `Действует ${durationMillis / 60000} минут с вероятностью поимки ${catchProbability}%`
    );

    this.emit2({
      type: 'catcherStatesChanged',
      catcherStates: this.catcherStates
    });
  }

  setCatcherStates({ catcherStates }: Req<SetCatcherStates>): Res<SetCatcherStates> {
    // this.logger.info('setCatcherStates');
    this.catcherStates = catcherStates;
    this.emit2({
      type: 'catcherStatesChanged',
      catcherStates: this.catcherStates
    });
  }

  decrementAttempt({ characterId }: Req<DecrementAttempt>): Res<DecrementAttempt> {
    const catcherData: CatcherData | undefined = this.catcherStates[characterId];
    if (catcherData === undefined) {
      this.logger.info(`SPIRIT_CATCHER_FAIL Not found catcher state for character ${characterId} for decrement attempt`);
      mmLog('SPIRIT_CATCHER_FAIL', `Not found catcher state for character ${characterId} for decrement attempt`);
      return;
    }
    if (catcherData.attemptNumber === 1) {
      delete this.catcherStates[characterId];
      this.logger.info(`SPIRIT_CATCHER_DECREMENT_ATTEMPT character ${characterId} attempts ended.`);
      mmLog('SPIRIT_CATCHER_DECREMENT_ATTEMPT', `character ${characterId} attempts ended.`);
    } else {
      this.catcherStates[characterId] = {
        ...catcherData,
        attemptNumber: catcherData.attemptNumber - 1
      };
      this.logger.info(`SPIRIT_CATCHER_DECREMENT_ATTEMPT character ${characterId} made catch attempt. New attempt ${catcherData.attemptNumber - 1}`);
      mmLog('SPIRIT_CATCHER_DECREMENT_ATTEMPT', `character ${characterId} made catch attempt. New attempt ${catcherData.attemptNumber - 1}`);
    }
    this.emit2({
      type: 'catcherStatesChanged',
      catcherStates: this.catcherStates
    });
  }

  removeCatcherStates({ expiredStatesList }: Req<RemoveCatcherStates>): Res<RemoveCatcherStates> {
    expiredStatesList.forEach(characterId => {
      delete this.catcherStates[characterId];
    });
    
    this.emit2({
      type: 'catcherStatesChanged',
      catcherStates: this.catcherStates
    });
  }

  getCatcherStates(request: Req<GetCatcherStates>): Res<GetCatcherStates> {
    return R.clone(this.catcherStates);
  }

  getCatcherState(request: Req<GetCatcherState>): Res<GetCatcherState> {
    return this.catcherStates[request.id];
  }
}