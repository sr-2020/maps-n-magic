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

export type GetFeatures = (arg: Typed<'features'>) => Feature[];
export type GetFeature = (arg: Typed<'feature', {
  id: string;
}>) => Feature | undefined;

// emit events

export type FeatureList = {
  features: Feature[]
};

export type EFeaturesChanged = Typed<'featuresChanged', FeatureList>;

// listen events

export type ESetFeatures = Typed<'setFeatures', FeatureList>;

export interface FeatureServiceContract extends ServiceContract {
  Action: never;
  Request: GetFeatures | GetFeature;
  EmitEvent: EFeaturesChanged;
  NeedAction: never;
  NeedRequest: never;
  ListenEvent: ESetFeatures;
}

const sort = R.sortBy(R.pipe(R.prop('humanReadableName'), R.toLower)) as (features: Feature[]) => Feature[];

export const featureMetadata: ServiceContractTypes<FeatureServiceContract> = {
  requests: ['features', 'feature'],
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
  featureIndex: Record<string, Feature>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(featureMetadata);
    this.features = [];
    this.featureIndex = {};
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
    // this.features = features;
    this.features = sort(features);
    this.featureIndex = R.indexBy(R.prop('id'), features);
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
      features: this.features
    });
  }

  getFeatures(request: Req<GetFeatures>): Res<GetFeatures> {
    return [...this.features];
  }

  getFeature(request: Req<GetFeature>): Res<GetFeature> {
    return this.featureIndex[request.id];
  }
}