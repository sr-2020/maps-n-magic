import * as R from 'ramda';
import { 
  AbstractService, 
  GameModel, 
  GMLogger, 
  ServiceContract, 
  ServiceContractTypes, 
} from 'sr2020-mm-event-engine';
import { GetCatcherStates, RemoveCatcherStates } from './SpiritCatcherService';

export interface SpiritCatcherUpdateServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: never;
  NeedAction: RemoveCatcherStates;
  NeedRequest: GetCatcherStates;
  ListenEvent: never;
}

export const spiritCatcherUpdateMetadata: ServiceContractTypes<SpiritCatcherUpdateServiceContract> = {
  requests: [],
  actions: [],
  emitEvents: [],
  listenEvents: [],
  needActions: ['removeCatcherStates'],
  needRequests: ['catcherStates'],
};

const SPIRIT_CATCHER_UPDATE_INTERVAL: number = 5000; // millis

export class SpiritCatcherUpdateService extends AbstractService<SpiritCatcherUpdateServiceContract> {
  updateTimerId: NodeJS.Timeout | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritCatcherUpdateMetadata);
    this.updateTimerId = null;
    this.updateSpiritCatcher = this.updateSpiritCatcher.bind(this);
  }

  init() {
    super.init();
    if (this.updateTimerId === null) {
      this.updateTimerId = setInterval(this.updateSpiritCatcher, SPIRIT_CATCHER_UPDATE_INTERVAL);
    } else {
      this.logger.error('SpiritCatcherUpdateService timer already initialized');
    }
  }

  dispose() {
    if (this.updateTimerId !== null) {
      clearInterval(this.updateTimerId);
    }
  }

  updateSpiritCatcher() {
    const dateNow = Date.now();
    const catcherStates = this.getFromModel2({
      type: 'catcherStates',
    });
    const expiredStatesList = R.toPairs(catcherStates)
      .reduce((acc: string[], [characterId, data]) => {
        if ((data.startTime + data.durationMillis) < dateNow) {
          acc.push(characterId);
        }
        return acc;
      }, []);
    if (expiredStatesList.length !== 0) {
      this.logger.info(`SPIRIT_CATCHER_EXPIRED expired list ${JSON.stringify(expiredStatesList)}`);
      this.executeOnModel2({
        type: 'removeCatcherStates',
        expiredStatesList
      });
    }
  }
}