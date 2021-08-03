import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { SpiritFraction } from "../../types";

import { 
  spiritFractionMetadata,
  GetSpiritFractions,
  GetSpiritFraction,
  EPutSpiritFractionConfirmed,
  ESetSpiritFractions,
  SpiritFractionEmitEvents,
  SpiritFractionListenEvents,
  SpiritFractionList,
  SpiritFractionServiceContract
} from "./types";


export class SpiritFractionService extends AbstractService<SpiritFractionServiceContract> {
  spiritFractions: SpiritFraction[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritFractionMetadata);
    this.spiritFractions = [];
    this.setSpiritFractions = this.setSpiritFractions.bind(this);
    this.putSpiritFractionConfirmed = this.putSpiritFractionConfirmed.bind(this);
  }

  init() {
    super.init();
    this.on2('setSpiritFractions', this.setSpiritFractions);
    this.on2('putSpiritFractionConfirmed', this.putSpiritFractionConfirmed);
  }

  dispose() {
    this.off2('setSpiritFractions', this.setSpiritFractions);
    this.off2('putSpiritFractionConfirmed', this.putSpiritFractionConfirmed);
  }

  setData({ spiritFractions = [] }: SpiritFractionList) {
    // this.logger.info("called setData with arr length", spirits.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(spirits, this.spirits, R.prop('id'));
    // this.spirits = [...unchanged, ...R.pluck('item', updated), ...added];
    // return spirits.length === this.spirits && unchanged.length === spirits.length;
    this.spiritFractions = spiritFractions;
  }

  getSpiritFractions(request: Req<GetSpiritFractions>): Res<GetSpiritFractions> {
    return [...this.spiritFractions];
  }

  getSpiritFraction ({ id }: Req<GetSpiritFraction>): Res<GetSpiritFraction> {
    const spirit = this.spiritFractions.find((spirit) => spirit.id === id);
    return spirit !== undefined ? {...spirit} : undefined;
  }

  setSpiritFractions({ spiritFractions }: ESetSpiritFractions ): void {
    this.setData({ spiritFractions });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'spiritFractionsChanged',
      spiritFractions,
    });
  }

  putSpiritFractionConfirmed({ spiritFraction }: EPutSpiritFractionConfirmed): void {
    const index: number = this.spiritFractions.findIndex((br) => br.id === spiritFraction.id);
    this.spiritFractions = [...this.spiritFractions];
    this.spiritFractions[index] = spiritFraction;
    this.emit2({ 
      type: 'putSpiritFraction',
      spiritFraction 
    });
    this.emit2({
      type: 'spiritFractionsChanged',
      spiritFractions: this.spiritFractions,
    });
  }
}
