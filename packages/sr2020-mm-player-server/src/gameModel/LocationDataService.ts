import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  ELocationRecordsChanged2,
  ESpiritsChanged,
  isGeoLocation,
  SpiritStatus,
  LocationView,
  SpiritView,
  AggregatedLocationView,
  Req,
  Res,
  GetAggLocationView,
  GetSpiritFraction,
  ESpiritFractionsChanged,
  GetSpirits,
  getSpiritLocationId,
  EFeaturesChanged
} from 'sr2020-mm-event-engine';
import { translateAbilities } from 'sr2020-mm-server-event-engine';

export interface LocationDataServiceContract extends ServiceContract {
  Request: GetAggLocationView;
  Action: never;
  // EmitEvent: LocationDataEmitEvents;
  EmitEvent: never;
  ListenEvent: 
    | ELocationRecordsChanged2
    | ESpiritsChanged
    | ESpiritFractionsChanged
    | EFeaturesChanged
  ;
  NeedAction: never;
  NeedRequest: 
    | GetSpiritFraction
    | GetSpirits
  ;
}

const metadata: ServiceContractTypes<LocationDataServiceContract> = {
  actions: [
    // 'onCharHealthUpdateReceived'
  ],
  requests: ['aggLocationView'],
  emitEvents: [
    // 'massacreTriggered'
  ],
  listenEvents: ['locationRecordsChanged2', 'spiritsChanged', 'spiritFractionsChanged', 'featuresChanged'],
  needRequests: ['spiritFraction', 'spirits'],
  needActions: []
};

const NEUTRAL_MANA_LEVEL = 4;

export class LocationDataService extends AbstractService<LocationDataServiceContract> {
  locationViews: LocationView[] = [];
  spiritViews: SpiritView[] = [];
  aggregatedLocationViews: AggregatedLocationView[] = [];
  aggregatedLocationViewIndex: Record<number, AggregatedLocationView> = {};

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.onLocationRecordsChanged = this.onLocationRecordsChanged.bind(this);
    this.onSpiritsChanged = this.onSpiritsChanged.bind(this);
    this.forceOnSpiritsChanged = this.forceOnSpiritsChanged.bind(this);
  }

  init() {
    super.init();
    this.on2('locationRecordsChanged2', this.onLocationRecordsChanged);
    this.on2('spiritsChanged', this.onSpiritsChanged);
    this.on2('spiritFractionsChanged', this.forceOnSpiritsChanged);
    this.on2('featuresChanged', this.forceOnSpiritsChanged);
  }
  
  dispose() {
    this.off2('locationRecordsChanged2', this.onLocationRecordsChanged);
    this.off2('spiritsChanged', this.onSpiritsChanged);
    this.off2('spiritFractionsChanged', this.forceOnSpiritsChanged);
    this.off2('featuresChanged', this.forceOnSpiritsChanged);
  }

  onLocationRecordsChanged(data: ELocationRecordsChanged2): void {
    const { locationRecords } = data;

    const locationViews: LocationView[] = locationRecords.filter(isGeoLocation).map(locationRecord => ({
      id: locationRecord.id,
      label: locationRecord.label,
      manaLevel: locationRecord.options.manaLevel || NEUTRAL_MANA_LEVEL
    }));
    // this.logger.info('onLocationRecordsChanged', locationViews);
    this.locationViews = locationViews;
    this.updateAggregatedLocationViews();
  }

  forceOnSpiritsChanged(): void {
    this.onSpiritsChanged({
      type: 'spiritsChanged',
      spirits: this.getFromModel2({type: 'spirits'})
    });
  }

  onSpiritsChanged(data: ESpiritsChanged): void {
    const { spirits } = data;

    const spiritViews: SpiritView[] = spirits.reduce((acc: SpiritView[], spirit) => {
      const { state } = spirit;
      if (state.status !== SpiritStatus.OnRoute) {
        return acc;
      }
      const locationId = getSpiritLocationId(spirit) as number;
      const fraction = this.getFromModel2({
        type: 'spiritFraction', 
        id: spirit.fraction
      });
      let abilities = [...spirit.abilities];
      if (fraction !== undefined) {
        abilities = R.uniq([...abilities, ...fraction.abilities]);
      } else {
        this.logger.error(`Spirit ${spirit.id} fraction not found. Fraction id ${spirit.fraction}`);
      }

      abilities = translateAbilities(this.gameModel, abilities);
      abilities.sort();
      // this.logger.info('fraction', fraction);
      acc.push({
        ...spirit,
        locationId,
        abilities
      });

      return acc;
    }, []);
    
    // this.logger.info('onSpiritsChanged', spiritViews);
    this.spiritViews = spiritViews;
    this.updateAggregatedLocationViews();
  }

  getAggLocationView ({ id }: Req<GetAggLocationView>): Res<GetAggLocationView> {
    return this.aggregatedLocationViewIndex[id];
  }

  updateAggregatedLocationViews() {
    const spiritViewIndex = this.spiritViews.reduce((acc: Record<number, SpiritView[]>, spiritView) => {
      const { locationId } = spiritView;
      if (acc[locationId] === undefined) {
        acc[locationId] = [];
      }
      acc[locationId].push(spiritView);
      return acc;
    }, {});

    const aggregatedLocationViews: AggregatedLocationView[] = this.locationViews.map(locationView => {
      return {
        ...locationView,
        spiritViews: spiritViewIndex[locationView.id] || []
      }
    });

    // this.logger.info('aggregatedLocationViews', aggregatedLocationViews);
    this.aggregatedLocationViews = aggregatedLocationViews;

    this.aggregatedLocationViewIndex = this.aggregatedLocationViews.reduce(
      (acc: Record<number, AggregatedLocationView>, loc) => {
        acc[loc.id] = loc;
        return acc;
      }, {}
    );
  }
}
