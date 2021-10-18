import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { Spirit } from "../../domain";

import { 
  spiritMetadata,
  GetSpirits,
  GetSpirit,
  EPutSpiritConfirmed,
  EPostSpiritConfirmed,
  EDeleteSpiritConfirmed,
  ESetSpirits,
  SpiritEmitEvents,
  SpiritListenEvents,
  SpiritList,
  ECloneSpiritRequested,
  SpiritServiceContract,
  EPutSpiritsConfirmed
} from "./types";


export class SpiritService extends AbstractService<SpiritServiceContract> {
  spirits: Spirit[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritMetadata);
    this.spirits = [];
    this.setSpirits = this.setSpirits.bind(this);
    this.postSpiritConfirmed = this.postSpiritConfirmed.bind(this);
    this.putSpiritConfirmed = this.putSpiritConfirmed.bind(this);
    this.putSpiritsConfirmed = this.putSpiritsConfirmed.bind(this);
    this.deleteSpiritConfirmed = this.deleteSpiritConfirmed.bind(this);
    this.cloneSpiritRequested = this.cloneSpiritRequested.bind(this);
  }

  init() {
    super.init();
    this.on2('setSpirits', this.setSpirits);
    this.on2('postSpiritConfirmed', this.postSpiritConfirmed);
    this.on2('putSpiritConfirmed', this.putSpiritConfirmed);
    this.on2('putSpiritsConfirmed', this.putSpiritsConfirmed);
    this.on2('deleteSpiritConfirmed', this.deleteSpiritConfirmed);
    this.on2('cloneSpiritRequested', this.cloneSpiritRequested);
  }

  dispose() {
    this.off2('setSpirits', this.setSpirits);
    this.off2('postSpiritConfirmed', this.postSpiritConfirmed);
    this.off2('putSpiritConfirmed', this.putSpiritConfirmed);
    this.off2('putSpiritsConfirmed', this.putSpiritsConfirmed);
    this.off2('deleteSpiritConfirmed', this.deleteSpiritConfirmed);
    this.off2('cloneSpiritRequested', this.cloneSpiritRequested);
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

  getSpirit ({ id }: Req<GetSpirit>): Res<GetSpirit> {
    const spirit = this.spirits.find((spirit) => spirit.id === id);
    return spirit !== undefined ? {...spirit} : undefined;
  }

  setSpirits({ spirits }: ESetSpirits ): void {
    // this.logger.info('setSpirits');
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

  putSpiritsConfirmed({ spirits }: EPutSpiritsConfirmed): void {
    const spiritIndex = R.indexBy(R.prop('id'), this.spirits);
    spirits.forEach(spirit => {
      spiritIndex[spirit.id] = spirit;
    });
    this.spirits = Object.values(spiritIndex);
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

  cloneSpiritRequested(event: ECloneSpiritRequested): void {
    const { id } = event;
    const spirit = this.spirits.find((br) => br.id === id);
    if (spirit === undefined) {
      return;
    }
    const props = {
      ...R.omit(['id'], spirit),
      name: this._makeSpiritName(spirit.name),
    };
    if ( props.state.status === 'NotInGame') {
      props.state = {
        status: 'NotInGame'
      };
    } else {
      props.state = {
        status: 'RestInAstral'
      };
    }
    this.emit2({
      type: 'postSpiritRequested',
      props
    });
  }

  private _makeSpiritName(name: string): string {
    const spiritMap = R.indexBy(R.prop('name'), this.spirits);
    const base = `${name} clone`;
    let newName = base;
    let counter = 1;
    // eslint-disable-next-line eqeqeq
    while (spiritMap[newName] != undefined) {
      newName = `${base} ${counter}`;
      counter++;
    }
    return newName;
  }
}
