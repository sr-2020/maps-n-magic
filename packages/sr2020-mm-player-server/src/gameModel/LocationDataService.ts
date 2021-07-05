import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  RawCharacterHealthState,
  Typed,
  ECharacterHealthStateChanged,
  // ELocationDataTriggered,
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
  GetSpirits
} from 'sr2020-mm-event-engine';

export interface LocationDataServiceContract extends ServiceContract {
  Request: GetAggLocationView;
  Action: never;
  // EmitEvent: LocationDataEmitEvents;
  EmitEvent: never;
  ListenEvent: 
    | ELocationRecordsChanged2
    | ESpiritsChanged
    | ESpiritFractionsChanged
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
  listenEvents: ['locationRecordsChanged2', 'spiritsChanged', 'spiritFractionsChanged'],
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
    this.onSpiritFractionsChanged = this.onSpiritFractionsChanged.bind(this);
  }

  init() {
    super.init();
    this.on2('locationRecordsChanged2', this.onLocationRecordsChanged);
    this.on2('spiritsChanged', this.onSpiritsChanged);
    this.on2('spiritFractionsChanged', this.onSpiritFractionsChanged);
  }
  
  dispose() {
    this.off2('locationRecordsChanged2', this.onLocationRecordsChanged);
    this.off2('spiritsChanged', this.onSpiritsChanged);
    this.off2('spiritFractionsChanged', this.onSpiritFractionsChanged);
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

  onSpiritFractionsChanged(): void {
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
      const { route, waypointIndex } = state;
      const locationId = route.waypoints[waypointIndex];
      const fraction = this.getFromModel2({
        type: 'spiritFraction', 
        id: spirit.fraction
      });
      // this.logger.info('fraction', fraction);
      acc.push({
        id: spirit.id,
        name: spirit.name,
        fraction: spirit.fraction,
        fractionName: fraction?.name || '',
        locationId
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
