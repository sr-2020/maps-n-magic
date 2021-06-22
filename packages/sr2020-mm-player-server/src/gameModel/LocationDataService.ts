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
  SpiritStatus
} from 'sr2020-mm-event-engine';

// export type LocationDataEmitEvents = ELocationDataTriggered;
export type LocationDataListenEvents = 
  | ELocationRecordsChanged2
  | ESpiritsChanged;

export interface LocationDataServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  // EmitEvent: LocationDataEmitEvents;
  EmitEvent: never;
  ListenEvent: LocationDataListenEvents;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<LocationDataServiceContract> = {
  actions: [
    // 'onCharHealthUpdateReceived'
  ],
  requests: [],
  emitEvents: [
    // 'massacreTriggered'
  ],
  listenEvents: ['locationRecordsChanged2', 'spiritsChanged'],
  needRequests: [],
  needActions: []
};

const NEUTRAL_MANA_LEVEL = 4;

interface LocationView {
  id: number;
  label: string;
  manaLevel: number;
}

interface SpiritView {
  id: number;
  name: string;
  fraction: number;
  locationId: number;
}

export class LocationDataService extends AbstractService<LocationDataServiceContract> {
  locationViews: LocationView[] = [];
  spiritViews: SpiritView[] = [];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.onLocationRecordsChanged = this.onLocationRecordsChanged.bind(this);
    this.onSpiritsChanged = this.onSpiritsChanged.bind(this);
  }

  init() {
    super.init();
    this.on2('locationRecordsChanged2', this.onLocationRecordsChanged);
    this.on2('spiritsChanged', this.onSpiritsChanged);
  }
  
  dispose() {
    this.off2('locationRecordsChanged2', this.onLocationRecordsChanged);
    this.off2('spiritsChanged', this.onSpiritsChanged);
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
      acc.push({
        id: spirit.id,
        name: spirit.name,
        fraction: spirit.fraction,
        locationId
      });
      return acc;
    }, []);
    
    // this.logger.info('onSpiritsChanged', spiritViews);
    this.spiritViews = spiritViews;
  }
}
