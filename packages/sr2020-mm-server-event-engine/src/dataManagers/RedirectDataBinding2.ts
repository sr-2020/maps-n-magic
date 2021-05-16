import * as R from 'ramda';
import { 
  GameModel, 
  GMLogger, 
  AbstractEventProcessor, 
  GMEvent,
  EPutCharHealthRequested,
  EPutCharHealthConfirmed,
  EPutCharLocationRequested,
  EPutCharLocationConfirmed,
  EEnableManaOceanRequested,
  EEnableManaOceanConfirmed,
  DefaultGMEvent,
  // EPutCh
} from "sr2020-mm-event-engine";


// {
//   putCharHealthRequested: 'putCharHealthConfirmed',
//   putCharLocationRequested: 'putCharLocationConfirmed',
//   enableManaOceanRequested: 'enableManaOceanConfirmed',
// },

// type EventBinding2<
//   FromEvent extends GMEvent, 
//   ToEvent extends GMEvent,
// > = Omit<FromEvent, "type"> extends Omit<ToEvent, "type"> ? {
//   from: FromEvent,
//   to: ToEvent
// } : never; 

type WeakEventBinding = {
  from: GMEvent,
  to: GMEvent
};

export type StrictEventBinding<
  FromEvent extends Omit<ToEvent, "type">, 
  ToEvent extends GMEvent,
> = {
  from: FromEvent,
  to: ToEvent
}; 

// type EventBindingList = 
//   StrictEventBinding<EPutCharHealthRequested, EPutCharHealthConfirmed> |
//   StrictEventBinding<EPutCharLocationRequested, EPutCharLocationConfirmed> |
//   StrictEventBinding<EEnableManaOceanRequested, EEnableManaOceanConfirmed>
// ;

// type BindingTypes = {
//   from: EPutCharHealthRequested,
//   to: EPutCharHealthConfirmed
// } | {
//   from: EPutCharLocationRequested,
//   to: EPutCharLocationConfirmed
// } | {
//   from: EEnableManaOceanRequested,
//   to: EEnableManaOceanConfirmed
// };

// type RedirectEventType = {
//   from: string;
//   to: string;
// };

// type t1 = EventBindingList["from"];
// type t11 = EventBindingList["from"]["type"];
// type t2 = EventBindingList["to"];

export class RedirectDataBinding2<
  // TEventBindingList extends StrictEventBinding<T extends GMEvent, DefaultGMEvent>
  TEventBindingList extends WeakEventBinding
> extends AbstractEventProcessor<
  TEventBindingList["to"],
  TEventBindingList["from"]
> {
  eventHandlers: {
    from: TEventBindingList["from"]["type"];
    handler: <Pair extends TEventBindingList>(action: Pair["from"]) => void;
  }[];

  constructor(
    protected gameModel: GameModel, 
    private redirectIndex: {
      from: TEventBindingList["from"]["type"],
      to: TEventBindingList["to"]["type"],
    }[],
    protected logger: GMLogger,
  ) {
    super(gameModel, logger);
    this.setMetadata({
      emitEvents: this.redirectIndex.map(R.prop('to')),
      listenEvents: this.redirectIndex.map(R.prop('from'))
    });
    this.eventHandlers = this.redirectIndex.map(({from, to}) => ({
      from,
      handler: <Pair extends TEventBindingList>(action: Pair["from"]) => {
        // console.log('redirect action', eventName);
        this.gameModel.emit2<Pair["to"]>({
          ...action,
          type: to,
        })
      }
    }));
    this.subscribe('on2', this.gameModel);
  }

  dispose() {
    this.subscribe('off2', this.gameModel);
  }

  private subscribe(action: 'on2' | 'off2', gameModel: GameModel) {
    this.logger.info('redirectIndex froms', this.redirectIndex.map(R.prop('from')));
    // this.logger.info('redirectIndex keys', R.keys(this.redirectIndex));
    this.eventHandlers.forEach(el => gameModel[action](el.from, el.handler));
    // console.log('redirectIndex keys', R.keys(this.redirectIndex));
    // R.keys(this.redirectIndex).forEach((eventName) => gameModel[action]<ListenEvent>(eventName, this.emit(eventName)));
  }
}

// new RedirectDataBinding2<EventBindingList>(1 as any, [
//   {from: 'putCharHealthRequested', to: 'putCharHealthConfirmed'},
//   {from: 'putCharLocationRequested', to: 'putCharLocationConfirmed'},
//   {from: 'enableManaOceanRequested', to: 'enableManaOceanConfirmed'},
// ], 3 as any);
