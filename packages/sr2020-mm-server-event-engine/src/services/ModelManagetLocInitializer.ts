import fetch from 'isomorphic-fetch';
import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  EPushNotification,
  PushNotification,
  ServiceContract,
  ServiceContractTypes,
  EPostLocationRecord
} from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from '../api';


export type PushNotificationEvents = EPushNotification;

export interface ModelManagetLocInitializerContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: never;
  ListenEvent: EPostLocationRecord;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<ModelManagetLocInitializerContract> = {
  actions: [],
  requests: [],
  emitEvents: [],
  listenEvents: ['postLocationRecord'],
  needActions: [],
  needRequests: []
};

export class ModelManagetLocInitializer extends AbstractService<ModelManagetLocInitializerContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.onPostLocationRecord = this.onPostLocationRecord.bind(this);
  }

  init() {
    super.init();
    this.on2('postLocationRecord', this.onPostLocationRecord);
  }

  dispose() {
    this.off2('postLocationRecord', this.onPostLocationRecord);
  }

  onPostLocationRecord(data: EPostLocationRecord): void {
    const { id } = data.locationRecord;
    fetch(genericServerConstants2().putLocationToModelsManager + '/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({})
    }).catch(err => {
      this.logger.error(`Error on putting location ${id} to models manager`, err);
    });
  }
}

