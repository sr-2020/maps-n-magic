import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res,
  TypeOnly,
  Typed,
  ServiceContract,
  ServiceContractTypes
} from '../core';

import { Feature } from "../types";

// requests

export type GetFeatures = (arg: TypeOnly<'features'>) => Feature[];

// emit events

export type FeatureList = {
  features: Feature[]
};

export type EFeaturesChanged = Typed<'featuresChanged', FeatureList>;

// listen events

export type ESetFeatures = Typed<'setFeatures', FeatureList>;

export interface FeatureServiceContract extends ServiceContract {
  Action: never;
  Request: GetFeatures;
  EmitEvent: EFeaturesChanged;
  NeedAction: never;
  NeedRequest: never;
  ListenEvent: ESetFeatures;
}

export const featureMetadata: ServiceContractTypes<FeatureServiceContract> = {
  requests: ['features'],
  actions: [],
  emitEvents: [
    'featuresChanged',
  ],
  listenEvents: [
    'setFeatures',
  ],
  needActions: [],
  needRequests: [],
};

export class FeatureService extends AbstractService<FeatureServiceContract> {
  features: Feature[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(featureMetadata);
    this.features = [];
    this.setFeatures = this.setFeatures.bind(this);
  }

  init() {
    super.init();
    this.on2('setFeatures', this.setFeatures);
  }

  dispose() {
    this.off2('setFeatures', this.setFeatures);
  }

  setData({ features = [] }: FeatureList) {
    // this.logger.info("called setData with arr length", spirits.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(spirits, this.spirits, R.prop('id'));
    // this.spirits = [...unchanged, ...R.pluck('item', updated), ...added];
    // return spirits.length === this.spirits && unchanged.length === spirits.length;
    this.features = features;
    this.logger.info('Features received, length ' + features.length);
  }

  setFeatures({ features }: ESetFeatures ): void {
    this.setData({ features });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'featuresChanged',
      features,
    });
  }

  getFeatures(request: Req<GetFeatures>): Res<GetFeatures> {
    return [...this.features];
  }
}