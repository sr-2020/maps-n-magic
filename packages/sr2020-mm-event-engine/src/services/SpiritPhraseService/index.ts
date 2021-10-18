import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { SpiritPhrase } from "../../domain";
import { sample } from '../../utils';

import { 
  spiritPhraseMetadata,
  GetSpiritPhrases,
  GetSpiritPhrase,
  EPutSpiritPhraseConfirmed,
  EPostSpiritPhraseConfirmed,
  EDeleteSpiritPhraseConfirmed,
  ESetSpiritPhrases,
  SpiritPhraseEmitEvents,
  SpiritPhraseListenEvents,
  SpiritPhraseList,
  SpiritPhraseServiceContract,
  GetRandomSpiritPhrase,
  EPutSpiritPhraseRequested
} from "./types";


export class SpiritPhraseService extends AbstractService<SpiritPhraseServiceContract> {
  spiritPhrases: SpiritPhrase[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(spiritPhraseMetadata);
    this.spiritPhrases = [];
    this.setSpiritPhrases = this.setSpiritPhrases.bind(this);
    this.postSpiritPhraseConfirmed = this.postSpiritPhraseConfirmed.bind(this);
    this.putSpiritPhraseConfirmed = this.putSpiritPhraseConfirmed.bind(this);
    this.deleteSpiritPhraseConfirmed = this.deleteSpiritPhraseConfirmed.bind(this);
    // this.cloneSpiritPhraseRequested = this.cloneSpiritPhraseRequested.bind(this);
  }

  init() {
    super.init();
    this.on2('setSpiritPhrases', this.setSpiritPhrases);
    this.on2('postSpiritPhraseConfirmed', this.postSpiritPhraseConfirmed);
    this.on2('putSpiritPhraseConfirmed', this.putSpiritPhraseConfirmed);
    this.on2('deleteSpiritPhraseConfirmed', this.deleteSpiritPhraseConfirmed);
    // this.on2('cloneSpiritPhraseRequested', this.cloneSpiritPhraseRequested);
  }

  dispose() {
    this.off2('setSpiritPhrases', this.setSpiritPhrases);
    this.off2('postSpiritPhraseConfirmed', this.postSpiritPhraseConfirmed);
    this.off2('putSpiritPhraseConfirmed', this.putSpiritPhraseConfirmed);
    this.off2('deleteSpiritPhraseConfirmed', this.deleteSpiritPhraseConfirmed);
    // this.off2('cloneSpiritPhraseRequested', this.cloneSpiritPhraseRequested);
  }

  setData({ spiritPhrases = [] }: SpiritPhraseList) {
    // this.logger.info("called setData with arr length", spiritPhrases.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(spiritPhrases, this.spiritPhrases, R.prop('id'));
    // this.spiritPhrases = [...unchanged, ...R.pluck('item', updated), ...added];
    // return spiritPhrases.length === this.spiritPhrases && unchanged.length === spiritPhrases.length;
    this.spiritPhrases = spiritPhrases;
  }

  getSpiritPhrases(request: Req<GetSpiritPhrases>): Res<GetSpiritPhrases> {
    return [...this.spiritPhrases];
  }

  getSpiritPhrase ({ id }: Req<GetSpiritPhrase>): Res<GetSpiritPhrase> {
    const spiritPhrase = this.spiritPhrases.find((spiritPhrase) => spiritPhrase.id === id);
    return spiritPhrase !== undefined ? {...spiritPhrase} : undefined;
  }

  getRandomSpiritPhrase ({ characterId, spiritFractionId }: Req<GetRandomSpiritPhrase>): Res<GetRandomSpiritPhrase> {
    const phrase = this.spiritPhrases.find(phrase => {
      return phrase.characterId === characterId &&
        // phrase.spiritFractionId === spiritFractionId &&
        phrase.delivered === false
    });
    if (phrase !== undefined) {
      this.gameModel.emit2<EPutSpiritPhraseRequested>({
        type: 'putSpiritPhraseRequested',
        id: phrase.id,
        props: {
          'delivered': true
        },
      });
      return phrase.message;
    }

    const curTime = Date.now();
    const phrases = this.spiritPhrases.filter((spiritPhrase) => {
      return spiritPhrase.startDate <= curTime && 
        curTime < spiritPhrase.endDate &&
        spiritPhrase.characterId === null
    });
    const item = sample(phrases);
    return item !== null ? item.message : item;
  }

  setSpiritPhrases({ spiritPhrases }: ESetSpiritPhrases ): void {
    // this.logger.info('setSpiritPhrases', spiritPhrases);
    this.setData({ spiritPhrases });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'spiritPhrasesChanged',
      spiritPhrases
    });
  }

  putSpiritPhraseConfirmed({ spiritPhrase }: EPutSpiritPhraseConfirmed): void {
    const index: number = this.spiritPhrases.findIndex((br) => br.id === spiritPhrase.id);
    this.spiritPhrases = [...this.spiritPhrases];
    this.spiritPhrases[index] = spiritPhrase;
    this.emit2({ 
      type: 'putSpiritPhrase',
      spiritPhrase 
    });
    this.emit2({
      type: 'spiritPhrasesChanged',
      spiritPhrases: this.spiritPhrases,
    });
  }

  postSpiritPhraseConfirmed({ spiritPhrase }: EPostSpiritPhraseConfirmed): void {
    this.spiritPhrases = [...this.spiritPhrases, spiritPhrase];
    // console.log('postSpiritPhrase');
    this.emit2({ 
      type: 'postSpiritPhrase',
      spiritPhrase 
    });
    this.emit2({
      type: 'spiritPhrasesChanged',
      spiritPhrases: this.spiritPhrases,
    });
  }
  
  deleteSpiritPhraseConfirmed({ spiritPhrase }: EDeleteSpiritPhraseConfirmed): void {
    this.spiritPhrases = this.spiritPhrases.filter((br) => br.id !== spiritPhrase.id);
    this.emit2({ 
      type: 'deleteSpiritPhrase',
      spiritPhrase 
    });
    this.emit2({
      type: 'spiritPhrasesChanged',
      spiritPhrases: this.spiritPhrases,
    });
  }

  // cloneSpiritPhraseRequested(event: ECloneSpiritPhraseRequested): void {
  //   const { id } = event;
  //   const spiritPhrase = this.spiritPhrases.find((br) => br.id === id);
  //   if (spiritPhrase === undefined) {
  //     return;
  //   }
  //   this.emit2({
  //     type: 'postSpiritPhraseRequested',
  //     props: {
  //       ...spiritPhrase,
  //       name: this._makeSpiritPhraseName(spiritPhrase.name)
  //     }
  //   });
  // }

  // private _makeSpiritPhraseName(name: string): string {
  //   const spiritPhraseMap = R.indexBy(R.prop('name'), this.spiritPhrases);
  //   const base = `${name} clone`;
  //   let newName = base;
  //   let counter = 1;
  //   // eslint-disable-next-line eqeqeq
  //   while (spiritPhraseMap[newName] != undefined) {
  //     newName = `${base} ${counter}`;
  //     counter++;
  //   }
  //   return newName;
  // }
}
