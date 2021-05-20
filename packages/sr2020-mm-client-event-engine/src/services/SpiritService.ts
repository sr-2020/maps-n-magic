export {};

// import * as R from 'ramda';

// // import type L, { LatLngLiteral } from "leaflet";

// // import { defaultSpirit } from '../../types/primitives';

// import { 
//   AbstractService,
//   GameModel,
//   GMLogger,
//   TypeOnly,
//   Typed,
//   Req,
//   Res,
//   Metadata,
//   Spirit
// } from 'sr2020-mm-event-engine';

// const defaultSpirit: Omit<Spirit, "id"> = {
//   name: '',
//   // aura: '',
//   fraction: '',
//   story: '',
//   abilities: [],

//   // latLng: {
//   //   lat: 0,
//   //   lng: 0,
//   // },
//   // plane: 'subastral',
//   // hitPoints: 10,
//   maxHitPoints: 10,
// };

// const metadata: Metadata = {
//   requests: ['spirits', 'spirit', 'spiritFractionsList', 'spiritAbilitiesList'],
//   actions: ['putSpirit', 'postSpirit', 'cloneSpirit', 'deleteSpirit'],
//   emitEvents: ['putSpirit', 'fractionChange'],
//   needActions:[], 
//   needRequests: [], 
//   listenEvents: []
// };

// // requests

// export type GetSpirits = (arg: TypeOnly<'spirits'>) => Spirit[];
// export type GetSpirit = (arg: Typed<'spirit', {
//   id: number
// }>) => Spirit | null;
// export type GetSpiritFractionsList = (arg: TypeOnly<'spiritFractionsList'>) => string[];
// export type GetSpiritAbilitiesList = (arg: TypeOnly<'spiritAbilitiesList'>) => string[];

// // actions

// export type PutSpirit = Typed<'putSpirit', {
//   id: number;
//   props: Partial<Spirit>
// }>;
// export type PostSpirit = Typed<'postSpirit', {
//   props: Partial<Spirit>
// }>;
// export type CloneSpirit = Typed<'cloneSpirit', {
//   id: number;
// }>;
// export type DeleteSpirit = Typed<'deleteSpirit', {
//   id: number;
// }>;

// // events

// export type EPutSpirit = Typed<'putSpirit', {
//   spirit: Spirit;
// }>;
// export type EFractionChange = Typed<'fractionChange', {
//   added: string[];
//   removed: string[];
//   fractions: string[];
// }>;
// export type SpiritEvents = 
//   EPutSpirit |
//   EFractionChange;


// export class SpiritService extends AbstractService<SpiritEvents> {
//   fractions: string[];
//   abilities: string[];
//   spirits: Spirit[];
//   maxSpiritId: number;

//   constructor(gameModel: GameModel, logger: GMLogger) {
//     super(gameModel, logger);
//     this.setMetadata(metadata);
//     this.fractions = [];
//     this.abilities = [];
//     this.spirits = [];
//     this.maxSpiritId = 1;
//   }

//   setData({ spirits }: {spirits: Spirit[]}) {
//     this.spirits = spirits || [];
//     this.maxSpiritId = R.reduce(R.max, 1, this.spirits.map(R.prop('id'))) as number;
//     if (this.spirits.length === 0) {
//       const fractions = ['Дрозд', 'Медведь', 'Неясыть'];
//       `Байкал
//       Ангара
//       Иркут
//       Селенга
//       Баргузин
//       Турка
//       Снежная
//       Витим
//       Орон
//       Сибихта
//       Чуро
//       Котеру
//       Ангаракан
//       Янчуй
//       Солзан
//       Утулик`.split('\n').map(R.trim).forEach((name, i) => this.postSpirit({
//         type: 'postSpirit',
//         props: { name, fraction: fractions[i % fractions.length] },
//       }));
//     }
//     this.spirits.filter((spirit) => spirit.maxHitPoints === undefined)
//       .forEach((spirit) => (spirit.maxHitPoints = 10));
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//   }

//   // getData() {
//   //   return {
//   //     spirits: this.getSpirits(),
//   //   };
//   // }

//   getSpirits (arg: Req<GetSpirits>): Res<GetSpirits> {
//     return this.spirits;
//   }

//   getSpirit ({ id }: Req<GetSpirit>): Res<GetSpirit> {
//     const spirit = this.spirits.find((spirit) => spirit.id === id);
//     return spirit !== undefined ? {...spirit} : null;
//     // return { ... };
//   }

//   getSpiritFractionsList (arg: Req<GetSpiritFractionsList>): Res<GetSpiritFractionsList> {
//     return this.fractions;
//   } 

//   getSpiritAbilitiesList (arg: Req<GetSpiritAbilitiesList>): Res<GetSpiritAbilitiesList> {
//     return this.abilities;
//   }

//   putSpirit ({ id, props }: PutSpirit) {
//     const index = this.spirits.findIndex((spirit) => spirit.id === id);
//     this.spirits[index] = {
//       ...this.spirits[index],
//       ...props,
//       id,
//     };
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//     this.emit2({
//       type: 'putSpirit',
//       spirit: R.clone(this.spirits[index])
//     });
//   }

//   postSpirit ({ props }: PostSpirit): Spirit {
//     this.maxSpiritId++;
//     this.spirits.push({
//       ...R.clone(defaultSpirit),
//       ...props,
//       id: this.maxSpiritId,
//       // name: String(this.maxSpiritId),
//     });
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//     return this.spirits[this.spirits.length - 1];
//   }

//   cloneSpirit({ id }: CloneSpirit): Spirit | null {
//     const spirit = this.getSpirit({ type: 'spirit', id });
//     if(spirit === null) {
//       return null;
//     }
//     return this.postSpirit({
//       type: 'postSpirit',
//       props: {
//         ...spirit,
//         name: this._makeSpiritName(spirit.name),
//       },
//     });
//   }

//   deleteSpirit ({ id }: DeleteSpirit) {
//     this.spirits = this.spirits.filter((spirit) => spirit.id !== id);
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//   }

//   private _makeSpiritName(name: string): string {
//     const spiritMap = R.indexBy(R.prop('name'), this.spirits);
//     const base = `${name} клон`;
//     let newName = base;
//     let counter = 1;
//     // eslint-disable-next-line eqeqeq
//     while (spiritMap[newName] != undefined) {
//       newName = `${base} ${counter}`;
//       counter++;
//     }
//     return newName;
//   }

//   private _updateSpiritFractionsList (): void {
//     const newFractions = R.without([''], R.uniq(this.spirits.map(R.prop('fraction'))));
//     if (this.fractions.length !== newFractions.length || R.symmetricDifference(newFractions, this.fractions).length > 0) {
//       this.fractions = newFractions;
//       this.emit2({
//         type: 'fractionChange',
//         added: R.difference(newFractions, this.fractions),
//         removed: R.difference(this.fractions, newFractions),
//         fractions: [...this.fractions],
//       });
//     }
//   }

//   private _updateSpiritAbilitiesList (): void {
//     const newAbilites = R.uniq(R.flatten(this.spirits.map(R.prop('abilities'))));
//     if (this.abilities.length !== newAbilites.length || R.symmetricDifference(newAbilites, this.abilities).length > 0) {
//       this.abilities = newAbilites;
//       // this.emit('fractionChange', R.clone(this.fractions));
//     }
//   }

//   // on(...args) {
//   //   const res = super.on.apply(this, args);
//   //   console.log('on', getEeStats(this));
//   //   return res;
//   // }

//   // off(...args) {
//   //   const res = super.off.apply(this, args);
//   //   console.log('off', getEeStats(this));
//   //   return res;
//   // }
// }
