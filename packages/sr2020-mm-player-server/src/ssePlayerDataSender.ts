import SSE from "./express-sse-ts";
import { Request, Response, NextFunction } from "express";
import { 
  CharacterModelData,
  ELocationRecordsChanged2, 
  ESpiritsChanged, 
  GameModel, 
  GetAggLocationView, 
  GetLocationRecords, 
  GetSpirits, 
  GetUserRecord, 
  GMLogger,
  TokenData
} from "sr2020-mm-event-engine";
import shortid from 'shortid';
import { CharacterWatcher } from "sr2020-mm-server-event-engine";

export class SsePlayerDataSender {
  sse: SSE;
  regularUpdateIntervalId: NodeJS.Timeout | undefined = undefined;
  uid: string;

  constructor(
    req: Request, 
    res: Response, 
    next: NextFunction,
    private logger: GMLogger,
    private gameModel: GameModel,
    private userData: TokenData,
    private characterWatcher: CharacterWatcher,
    characterModelData: CharacterModelData
  ) {
    this.logger.info('SsePlayerDataSender init');
    this.send = this.send.bind(this);
    this.onCharacterModelUpdate = this.onCharacterModelUpdate.bind(this);
    this.sse = new SSE();
    this.sse.init(req, res, next);
    this.uid = shortid.generate();
    req.once('close', () => {
      this.dispose();
    });
    characterWatcher.on2(this.uid, this.userData.modelId, this.onCharacterModelUpdate);
    // const spirits = gameModel.get2<GetSpirits>('spirits');
    // const spiritsChanged: ESpiritsChanged = {
    //   'type': 'spiritsChanged',
    //   spirits
    // };
    // this.send(spiritsChanged);
    // const locationRecords = gameModel.get2<GetLocationRecords>('locationRecords');
    // const locationRecordsChanged: ELocationRecordsChanged2 = {
    //   'type': 'locationRecordsChanged2',
    //   locationRecords
    // };
    // this.send(locationRecordsChanged);

    // gameModel.on2<ESpiritsChanged>('spiritsChanged', this.send);
    // gameModel.on2<ELocationRecordsChanged2>('locationRecordsChanged2', this.send);
    
    this.send(characterModelData);
    this.sendCurrentData();
    // this.send('Hi player! From ' + this.uid);
    this.regularUpdateIntervalId = setInterval(() => {
      this.sendCurrentData();
      // this.send('Hi player! From ' + this.uid);
      // this.logger.info('Hi player! From ' + this.uid);
    }, 5000);
    // setTimeout(() => this.send('Hi player!'), 1000);
  }

  onCharacterModelUpdate(data: CharacterModelData) {
    this.send(data);
    // this.logger.info(`got character update. model id ${this.userData.modelId}`);
  }

  sendCurrentData(): void {
    // this.logger.info('SsePlayerDataSender sendCurrentData');
    const userRecord = this.gameModel.get2<GetUserRecord>({
      'type': 'userRecord',
      'id': this.userData.modelId
    });
    if (userRecord === undefined) {
      this.logger.error(`User with id ${this.userData.modelId} not found`);
      return;
    }
    const { location_id } = userRecord;
    if (location_id === null) {
      this.send(null);
      return;
    }

    const aggLocationView = this.gameModel.get2<GetAggLocationView>({
      type: 'aggLocationView',
      id: location_id
    });
    if (aggLocationView === undefined) {
      this.logger.error(`Location data with id ${location_id} for user with id ${this.userData.modelId} not found`);
      return;
    }
    this.send(aggLocationView);
  }

  send(object: unknown): void {
    // this.logger.info('SsePlayerDataSender send');
    this.sse.send(JSON.stringify(object), 'message');
  }

  dispose() {
    this.logger.info('SsePlayerDataSender dispose');
    if (this.regularUpdateIntervalId !== undefined) {
      clearInterval(this.regularUpdateIntervalId);
    }
    this.characterWatcher.off2(this.uid, this.userData.modelId, this.onCharacterModelUpdate);
    // this.gameModel.off('spiritsChanged', this.send);
    // this.gameModel.off('locationRecordsChanged2', this.send);
  }
}