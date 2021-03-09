import * as R from 'ramda';
import moment from 'moment-timezone';

import { 
  AbstractService, 
  isClinicallyDead, 
  Metadata,
  GMLogger,
  GameModel,
  ECharacterHealthStateChanged
} from 'sr2020-mm-event-engine';

const RESCUE_SERVICE_UPDATE_INTERVAL = 5000; // ms
const RESCUE_SERVICE_PUSH_INTERVAL = 10 * 60000; // 10 minutes
// const RESCUE_SERVICE_PUSH_INTERVAL = 10 * 6000; // 10 minutes

const metadata: Metadata = {
  actions: [],
  requests: [],
  emitEvents: [],
  needActions: [
    'pushNotification',
  ],
  needRequests: [],
  listenEvents: [
    'characterHealthStateChanged',
  ],
};

export class RescueServicePushService extends AbstractService {
  informCharacterTimerId: NodeJS.Timeout | null;

  characterIndex: Map<number, {
    msgId: number;
    timestamp: number;
  }>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.informCharacterTimerId = null;
    this.characterIndex = new Map();
    this.onInformCharacterTimeout = this.onInformCharacterTimeout.bind(this);
    this.onCharacterHealthStateChanged = this.onCharacterHealthStateChanged.bind(this);
  }

  init() {
    super.init();
    if (this.informCharacterTimerId === null) {
      this.informCharacterTimerId = setInterval(this.onInformCharacterTimeout, RESCUE_SERVICE_UPDATE_INTERVAL);
    } else {
      this.logger.error('informCharacterTimer already initialized');
    }
    this.on('characterHealthStateChanged', this.onCharacterHealthStateChanged);
  }

  dispose() {
    if (this.informCharacterTimerId !== null) {
      clearInterval(this.informCharacterTimerId);
    }
    this.off('characterHealthStateChanged', this.onCharacterHealthStateChanged);
  }

  // {
  //   "type": "characterHealthStateChanged",
  //   "characterId": 51935,
  //   "characterHealthState": {
  //     "locationId": 3217,
  //     "locationLabel": "Мастерка",
  //     "healthState": "wounded",
  //     "timestamp": 1606412281732,
  //     "lifeStyle": "Wood",
  //     "personName": "Новый персонаж в группе Мастера и приложение !!!(Без страховки)!!!"
  //   }
  // }
  onCharacterHealthStateChanged(data: ECharacterHealthStateChanged) {
    const { characterId, characterHealthState } = data;
    // this.logger.info(data);
    if (isClinicallyDead(characterHealthState)) {
      this.characterIndex.set(characterId, {
        msgId: 1,
        timestamp: characterHealthState.timestamp,
      });
    } else {
      this.characterIndex.delete(characterId);
    }
  }

  onInformCharacterTimeout() {
    // this.logger.info('onInformCharacterTimeout');

    const curTime = moment().utc().valueOf();
    [...this.characterIndex].forEach(([characterId, data]) => {
      const { msgId, timestamp } = data;
      const timeDelta = curTime - timestamp;
      if (timeDelta > msgId * RESCUE_SERVICE_PUSH_INTERVAL) {
        this.executeOnModel({
          type: 'pushNotification',
          characterId,
          title: `Вы находитесь в КС ${msgId * 10} минут`,
          message: '',
        });
        if (msgId === 3) {
          this.characterIndex.delete(characterId);
        } else {
          data.msgId++;
        }
      }
    });
  }
}
