import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { Spirit } from "../../types";

import { 
  spiritMetadata,
  GetSpirits,
  EPutSpiritConfirmed,
  EPostSpiritConfirmed,
  EDeleteSpiritConfirmed,
  ESetSpirits,
  SpiritEmitEvents,
  SpiritListenEvents,
  SpiritList
} from "./types";

export class SpiritService extends AbstractService<SpiritEmitEvents, SpiritListenEvents> {
  spirits: Spirit[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritMetadata);
    this.spirits = [];
    this.setSpirits = this.setSpirits.bind(this);
    this.postSpiritConfirmed = this.postSpiritConfirmed.bind(this);
    this.putSpiritConfirmed = this.putSpiritConfirmed.bind(this);
    this.deleteSpiritConfirmed = this.deleteSpiritConfirmed.bind(this);
  }

  init() {
    super.init();
    this.on2('setSpirits', this.setSpirits);
    this.on2('postSpiritConfirmed', this.postSpiritConfirmed);
    this.on2('putSpiritConfirmed', this.putSpiritConfirmed);
    this.on2('deleteSpiritConfirmed', this.deleteSpiritConfirmed);
  }

  dispose() {
    this.off2('setSpirits', this.setSpirits);
    this.off2('postSpiritConfirmed', this.postSpiritConfirmed);
    this.off2('putSpiritConfirmed', this.putSpiritConfirmed);
    this.off2('deleteSpiritConfirmed', this.deleteSpiritConfirmed);
  }

  setData({ spirits = [] }: SpiritList) {
    // this.logger.info("called setData with arr length", spirits.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(spirits, this.spirits, R.prop('id'));
    // this.spirits = [...unchanged, ...R.pluck('item', updated), ...added];
    // return spirits.length === this.spirits && unchanged.length === spirits.length;
    this.spirits = spirits;
  }

  getSpirits(request: Req<GetSpirits>): Res<GetSpirits> {
    return [...this.spirits];
  }

  setSpirits({ spirits }: ESetSpirits ): void {
    this.setData({ spirits });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'spiritsChanged',
      spirits,
    });
  }

  putSpiritConfirmed({ spirit }: EPutSpiritConfirmed): void {
    const index: number = this.spirits.findIndex((br) => br.id === spirit.id);
    this.spirits = [...this.spirits];
    this.spirits[index] = spirit;
    this.emit2({ 
      type: 'putSpirit',
      spirit 
    });
    this.emit2({
      type: 'spiritsChanged',
      spirits: this.spirits,
    });
  }

  postSpiritConfirmed({ spirit }: EPostSpiritConfirmed): void {
    this.spirits = [...this.spirits, spirit];
    // console.log('postSpirit');
    this.emit2({ 
      type: 'postSpirit',
      spirit 
    });
    this.emit2({
      type: 'spiritsChanged',
      spirits: this.spirits,
    });
  }
  
  deleteSpiritConfirmed({ spirit }: EDeleteSpiritConfirmed): void {
    this.spirits = this.spirits.filter((br) => br.id !== spirit.id);
    this.emit2({ 
      type: 'deleteSpirit',
      spirit 
    });
    this.emit2({
      type: 'spiritsChanged',
      spirits: this.spirits,
    });
  }

}