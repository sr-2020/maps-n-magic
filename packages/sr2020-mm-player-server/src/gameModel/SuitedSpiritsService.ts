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
  GetIsInSpiritSuit
} from 'sr2020-mm-event-engine';

export interface SuitedSpiritsServiceContract extends ServiceContract {
  Request: GetIsInSpiritSuit;
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
  requests: ['isInSpiritSuit'],
  emitEvents: [],
  listenEvents: ['spiritsChanged'],
  needRequests: [],
  needActions: []
};

export class SuitedSpiritsService extends AbstractService<SuitedSpiritsServiceContract> {
  charactersInSuit: Set<number> = new Set();

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
        this.charactersInSuit.add(state.characterId);
      }
    })
  }

  getIsInSpiritSuit ({ characterid }: Req<GetIsInSpiritSuit>): Res<GetIsInSpiritSuit> {
    return this.charactersInSuit.has(characterid)
  }
}
