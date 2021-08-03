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
  SuitedState,
  Typed,
  MessageData
} from 'sr2020-mm-event-engine';


export type PutCharacterMessage = Typed<'putCharacterMessage', {
  characterId: number;
  data: MessageData
}>;

export type GetCharacterMessage = (arg: Typed<'characterMessage', {characterId: number}>) => MessageData | undefined;

export interface MessageServiceContract extends ServiceContract {
  Request: GetCharacterMessage;
  Action: PutCharacterMessage;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<MessageServiceContract> = {
  actions: ['putCharacterMessage'],
  requests: ['characterMessage'],
  emitEvents: [],
  listenEvents: [],
  needRequests: [],
  needActions: []
};

export class MessageService extends AbstractService<MessageServiceContract> {
  characterMessages: Map<number, MessageData> = new Map();

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }

  putCharacterMessage({ characterId, data } : PutCharacterMessage): void {
    this.characterMessages.set(characterId, data);
  }

  getCharacterMessage(args: Req<GetCharacterMessage>): Res<GetCharacterMessage> {
    return this.characterMessages.get(args.characterId);
  }
}
