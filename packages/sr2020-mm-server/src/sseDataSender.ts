import SSE from "./express-sse-ts";
import { Request, Response, NextFunction } from "express";
import { EFeaturesChanged, ELocationRecordsChanged2, ESpiritFractionsChanged, ESpiritPhrasesChanged, ESpiritsChanged, EUserRecordsChanged, GameModel, GetFeatures, GetLocationRecords, GetSpiritFractions, GetSpiritPhrases, GetSpirits, GetUserRecords, GMLogger } from "sr2020-mm-event-engine";
import { ECatcherStatesChanged, GetCatcherStates, InnerApiRequest } from "sr2020-mm-server-event-engine";

export class SseDataSender {
  sse: SSE;
  gameModel: GameModel;

  constructor(
    req: InnerApiRequest, 
    res: Response, 
    next: NextFunction,
    private logger: GMLogger,
  ) {
    this.gameModel = req.gameModel;
    this.send = this.send.bind(this);
    this.sse = new SSE();
    this.sse.init(req, res, next);
    req.once('close', () => {
      this.dispose();
    });

    this.initSpiritDataSending(this.gameModel);
    this.initSpiritFractionDataSending(this.gameModel);
    this.initLocationDataSending(this.gameModel);
    this.initUserDataSending(this.gameModel);
    this.initCatcherStatesSending(this.gameModel);
    this.initFeaturesSending(this.gameModel);
    this.initSpiritPhrasesSending(this.gameModel);
  }

  private initSpiritPhrasesSending(gameModel: GameModel) {
    const spiritPhrases = gameModel.get2<GetSpiritPhrases>({
      type: 'spiritPhrases'
    });
    const spiritPhrasesChanged: ESpiritPhrasesChanged = {
      'type': 'spiritPhrasesChanged',
      spiritPhrases
    };
    this.send(spiritPhrasesChanged);
    gameModel.on2<ESpiritPhrasesChanged>('spiritPhrasesChanged', this.send);
  }

  private initFeaturesSending(gameModel: GameModel) {
    const features = gameModel.get2<GetFeatures>({
      type: 'features'
    });
    const featuresChanged: EFeaturesChanged = {
      'type': 'featuresChanged',
      features
    };
    this.send(featuresChanged);
    gameModel.on2<EFeaturesChanged>('featuresChanged', this.send);
  }

  private initCatcherStatesSending(gameModel: GameModel) {
    const catcherStates = gameModel.get2<GetCatcherStates>({
      type: 'catcherStates'
    });
    const catcherStatesChanged: ECatcherStatesChanged = {
      'type': 'catcherStatesChanged',
      catcherStates
    };
    this.send(catcherStatesChanged);
    gameModel.on2<ECatcherStatesChanged>('catcherStatesChanged', this.send);
  }

  private initUserDataSending(gameModel: GameModel) {
    const userRecords = gameModel.get2<GetUserRecords>('userRecords');
    const userRecordsChanged: EUserRecordsChanged = {
      'type': 'userRecordsChanged',
      userRecords
    };
    this.send(userRecordsChanged);
    gameModel.on2<EUserRecordsChanged>('userRecordsChanged', this.send);
  }

  private initLocationDataSending(gameModel: GameModel) {
    const locationRecords = gameModel.get2<GetLocationRecords>('locationRecords');
    const locationRecordsChanged: ELocationRecordsChanged2 = {
      'type': 'locationRecordsChanged2',
      locationRecords
    };
    this.send(locationRecordsChanged);
    gameModel.on2<ELocationRecordsChanged2>('locationRecordsChanged2', this.send);
  }

  private initSpiritDataSending(gameModel: GameModel) {
    const spirits = gameModel.get2<GetSpirits>('spirits');
    const spiritsChanged: ESpiritsChanged = {
      'type': 'spiritsChanged',
      spirits
    };
    this.send(spiritsChanged);
    gameModel.on2<ESpiritsChanged>('spiritsChanged', this.send);
  }

  private initSpiritFractionDataSending(gameModel: GameModel) {
    const spiritFractions = gameModel.get2<GetSpiritFractions>('spiritFractions');
    const spiritsChanged: ESpiritFractionsChanged = {
      'type': 'spiritFractionsChanged',
      spiritFractions
    };
    this.send(spiritsChanged);
    gameModel.on2<ESpiritFractionsChanged>('spiritFractionsChanged', this.send);
  }

  send(object: unknown): void {
    this.sse.send(JSON.stringify(object), 'message');
  }

  dispose() {
    this.logger.info('SseDataSender dispose');
    this.gameModel.off('spiritsChanged', this.send);
    this.gameModel.off('spiritFractionsChanged', this.send);
    this.gameModel.off('locationRecordsChanged2', this.send);
    this.gameModel.off('userRecordsChanged', this.send);
    this.gameModel.off('catcherStatesChanged', this.send);
    this.gameModel.off('featuresChanged', this.send);
    this.gameModel.off('spiritPhrasesChanged', this.send);
  }
}