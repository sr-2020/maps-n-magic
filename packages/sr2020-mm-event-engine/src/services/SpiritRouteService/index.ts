import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { SpiritRoute } from "../../domain";

import { 
  spiritRouteMetadata,
  GetSpiritRoutes,
  GetSpiritRoute,
  EPutSpiritRouteConfirmed,
  EPostSpiritRouteConfirmed,
  EDeleteSpiritRouteConfirmed,
  ESetSpiritRoutes,
  SpiritRouteEmitEvents,
  SpiritRouteListenEvents,
  SpiritRouteList,
  ECloneSpiritRouteRequested,
  SpiritRouteServiceContract
} from "./types";


export class SpiritRouteService extends AbstractService<SpiritRouteServiceContract> {
  spiritRoutes: SpiritRoute[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritRouteMetadata);
    this.spiritRoutes = [];
    this.setSpiritRoutes = this.setSpiritRoutes.bind(this);
    this.postSpiritRouteConfirmed = this.postSpiritRouteConfirmed.bind(this);
    this.putSpiritRouteConfirmed = this.putSpiritRouteConfirmed.bind(this);
    this.deleteSpiritRouteConfirmed = this.deleteSpiritRouteConfirmed.bind(this);
    this.cloneSpiritRouteRequested = this.cloneSpiritRouteRequested.bind(this);
  }

  init() {
    super.init();
    this.on2('setSpiritRoutes', this.setSpiritRoutes);
    this.on2('postSpiritRouteConfirmed', this.postSpiritRouteConfirmed);
    this.on2('putSpiritRouteConfirmed', this.putSpiritRouteConfirmed);
    this.on2('deleteSpiritRouteConfirmed', this.deleteSpiritRouteConfirmed);
    this.on2('cloneSpiritRouteRequested', this.cloneSpiritRouteRequested);
  }

  dispose() {
    this.off2('setSpiritRoutes', this.setSpiritRoutes);
    this.off2('postSpiritRouteConfirmed', this.postSpiritRouteConfirmed);
    this.off2('putSpiritRouteConfirmed', this.putSpiritRouteConfirmed);
    this.off2('deleteSpiritRouteConfirmed', this.deleteSpiritRouteConfirmed);
    this.off2('cloneSpiritRouteRequested', this.cloneSpiritRouteRequested);
  }

  setData({ spiritRoutes = [] }: SpiritRouteList) {
    // this.logger.info("called setData with arr length", spiritRoutes.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(spiritRoutes, this.spiritRoutes, R.prop('id'));
    // this.spiritRoutes = [...unchanged, ...R.pluck('item', updated), ...added];
    // return spiritRoutes.length === this.spiritRoutes && unchanged.length === spiritRoutes.length;
    this.spiritRoutes = spiritRoutes;
  }

  getSpiritRoutes(request: Req<GetSpiritRoutes>): Res<GetSpiritRoutes> {
    return [...this.spiritRoutes];
  }

  getSpiritRoute ({ id }: Req<GetSpiritRoute>): Res<GetSpiritRoute> {
    const spiritRoute = this.spiritRoutes.find((spiritRoute) => spiritRoute.id === id);
    return spiritRoute !== undefined ? {...spiritRoute} : undefined;
  }

  setSpiritRoutes({ spiritRoutes }: ESetSpiritRoutes ): void {
    this.setData({ spiritRoutes });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'spiritRoutesChanged',
      spiritRoutes,
    });
  }

  putSpiritRouteConfirmed({ spiritRoute }: EPutSpiritRouteConfirmed): void {
    const index: number = this.spiritRoutes.findIndex((br) => br.id === spiritRoute.id);
    this.spiritRoutes = [...this.spiritRoutes];
    this.spiritRoutes[index] = spiritRoute;
    this.emit2({ 
      type: 'putSpiritRoute',
      spiritRoute 
    });
    this.emit2({
      type: 'spiritRoutesChanged',
      spiritRoutes: this.spiritRoutes,
    });
  }

  postSpiritRouteConfirmed({ spiritRoute }: EPostSpiritRouteConfirmed): void {
    this.spiritRoutes = [...this.spiritRoutes, spiritRoute];
    // console.log('postSpiritRoute');
    this.emit2({ 
      type: 'postSpiritRoute',
      spiritRoute 
    });
    this.emit2({
      type: 'spiritRoutesChanged',
      spiritRoutes: this.spiritRoutes,
    });
  }
  
  deleteSpiritRouteConfirmed({ spiritRoute }: EDeleteSpiritRouteConfirmed): void {
    this.spiritRoutes = this.spiritRoutes.filter((br) => br.id !== spiritRoute.id);
    this.emit2({ 
      type: 'deleteSpiritRoute',
      spiritRoute 
    });
    this.emit2({
      type: 'spiritRoutesChanged',
      spiritRoutes: this.spiritRoutes,
    });
  }

  cloneSpiritRouteRequested(event: ECloneSpiritRouteRequested): void {
    const { id } = event;
    const spiritRoute = this.spiritRoutes.find((br) => br.id === id);
    if (spiritRoute === undefined) {
      return;
    }
    this.emit2({
      type: 'postSpiritRouteRequested',
      props: {
        ...spiritRoute,
        name: this._makeSpiritRouteName(spiritRoute.name)
      }
    });
  }

  private _makeSpiritRouteName(name: string): string {
    const spiritRouteMap = R.indexBy(R.prop('name'), this.spiritRoutes);
    const base = `${name} clone`;
    let newName = base;
    let counter = 1;
    // eslint-disable-next-line eqeqeq
    while (spiritRouteMap[newName] != undefined) {
      newName = `${base} ${counter}`;
      counter++;
    }
    return newName;
  }
}
