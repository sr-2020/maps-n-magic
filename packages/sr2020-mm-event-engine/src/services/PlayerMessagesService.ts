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

import { PlayerMessage } from "../types";

// requests

export type GetPlayerMessages = (arg: Typed<'playerMessages'>) => PlayerMessage[];
// export type GetPlayerMessage = (arg: Typed<'playerMessage', {
//   id: string;
// }>) => PlayerMessage | undefined;

// emit events

export type PlayerMessageList = {
  playerMessages: PlayerMessage[]
};

export type EPlayerMessagesChanged = Typed<'playerMessagesChanged', PlayerMessageList>;

// listen events

export type ESetPlayerMessages = Typed<'setPlayerMessages', PlayerMessageList>;

export interface PlayerMessagesServiceContract extends ServiceContract {
  Action: never;
  Request: GetPlayerMessages;
  EmitEvent: EPlayerMessagesChanged;
  NeedAction: never;
  NeedRequest: never;
  ListenEvent: ESetPlayerMessages;
}

// const sort = R.sortBy(R.pipe(R.prop('humanReadableName'), R.toLower)) as (playerMessages: PlayerMessage[]) => PlayerMessage[];
const sort = R.sortBy(el => -new Date(el.id).getTime()) as (playerMessages: PlayerMessage[]) => PlayerMessage[];

export const playerMessageMetadata: ServiceContractTypes<PlayerMessagesServiceContract> = {
  requests: ['playerMessages'],
  actions: [],
  emitEvents: [
    'playerMessagesChanged',
  ],
  listenEvents: [
    'setPlayerMessages',
  ],
  needActions: [],
  needRequests: [],
};

export class PlayerMessagesService extends AbstractService<PlayerMessagesServiceContract> {
  playerMessages: PlayerMessage[];
  // playerMessageIndex: Record<string, PlayerMessage>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(playerMessageMetadata);
    this.playerMessages = [];
    // this.playerMessageIndex = {};
    this.setPlayerMessages = this.setPlayerMessages.bind(this);
  }

  init() {
    super.init();
    this.on2('setPlayerMessages', this.setPlayerMessages);
  }

  dispose() {
    this.off2('setPlayerMessages', this.setPlayerMessages);
  }

  setData({ playerMessages = [] }: PlayerMessageList) {
    // this.logger.info("called setData with arr length", spirits.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(spirits, this.spirits, R.prop('id'));
    // this.spirits = [...unchanged, ...R.pluck('item', updated), ...added];
    // return spirits.length === this.spirits && unchanged.length === spirits.length;
    // this.playerMessages = playerMessages;
    this.playerMessages = sort(playerMessages);
    // this.playerMessageIndex = R.indexBy(R.prop('id'), playerMessages);
    // this.logger.info('PlayerMessages received, length ' + playerMessages.length);
    // this.logger.info('PlayerMessages received', this.playerMessages);
  }

  setPlayerMessages({ playerMessages }: ESetPlayerMessages ): void {
    this.setData({ playerMessages });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'playerMessagesChanged',
      playerMessages: this.playerMessages
    });
  }

  getPlayerMessages(request: Req<GetPlayerMessages>): Res<GetPlayerMessages> {
    return [...this.playerMessages];
  }

  // getPlayerMessage(request: Req<GetPlayerMessage>): Res<GetPlayerMessage> {
  //   return this.playerMessageIndex[request.id];
  // }
}