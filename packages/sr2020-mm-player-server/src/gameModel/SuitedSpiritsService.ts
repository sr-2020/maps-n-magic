import * as R from 'ramda';

import { 
  AbstractService, 
  GMLogger,
  GameModel,
  ServiceContract,
  ServiceContractTypes,
  ESpiritsChanged,
  Req,
  Res,
  GetSpiritSuitState,
  SuitedState
} from 'sr2020-mm-event-engine';

export interface SuitedSpiritsServiceContract extends ServiceContract {
  Request: GetSpiritSuitState;
  Action: never;
  EmitEvent: never;
  ListenEvent: 
    | ESpiritsChanged
  ;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<SuitedSpiritsServiceContract> = {
  actions: [],
  requests: ['spiritSuitState'],
  emitEvents: [],
  listenEvents: ['spiritsChanged'],
  needRequests: [],
  needActions: []
};

export class SuitedSpiritsService extends AbstractService<SuitedSpiritsServiceContract> {
  charactersInSuit: Map<number, SuitedState> = new Map();

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.onSpiritsChanged = this.onSpiritsChanged.bind(this);
  }

  init() {
    super.init();
    this.on2('spiritsChanged', this.onSpiritsChanged);
  }
  
  dispose() {
    this.off2('spiritsChanged', this.onSpiritsChanged);
  }

  onSpiritsChanged(data: ESpiritsChanged): void {
    const { spirits } = data;

    this.charactersInSuit.clear();

    spirits.forEach(spirit => {
      const { state } = spirit;
      if (state.status === 'Suited') {
        this.charactersInSuit.set(state.characterId, state);
      }
    })
  }

  getSpiritSuitState ({ characterid }: Req<GetSpiritSuitState>): Res<GetSpiritSuitState> {
    return this.charactersInSuit.get(characterid)
  }
}
