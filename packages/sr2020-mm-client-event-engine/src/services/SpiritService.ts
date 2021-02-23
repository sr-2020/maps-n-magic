// import * as R from 'ramda';

// // import { defaultSpirit } from '../../types/primitives';

// import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

// const defaultSpirit = {
//   name: '',
//   aura: '',
//   fraction: '',
//   story: '',
//   abilities: [],

//   latLng: {
//     lat: 0,
//     lng: 0,
//   },
//   plane: 'subastral',
//   hitPoints: 10,
//   maxHitPoints: 10,
// };

// const metadata = {
//   actions: ['putSpirit', 'postSpirit', 'cloneSpirit', 'deleteSpirit'],
//   requests: ['spirits', 'spirit', 'spiritFractionsList', 'spiritAbilitiesList'],
//   emitEvents: ['putSpirit', 'fractionChange'],
// };
// export class SpiritService extends AbstractService {
//   fractions: any;
//   abilities: any;
//   spirits: any;
//   maxSpiritId: any;

//   constructor(logger) {
//     super(logger);
//     this.setMetadata(metadata);
//     this.fractions = [];
//     this.abilities = [];
//     this.spirits = [];
//     this.maxSpiritId = 1;
//   }

//   // @ts-ignore
//   setData({ spirits } = {}) {
//     this.spirits = spirits || [];
//     this.maxSpiritId = R.reduce(R.max, 1, this.spirits.map(R.prop('id')));
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
//           props: { name, fraction: fractions[i % fractions.length] },
//         }));
//     }
//     this.spirits.filter((spirit) => spirit.maxHitPoints === undefined)
//       .forEach((spirit) => (spirit.maxHitPoints = 10));
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//   }

//   getData() {
//     return {
//       spirits: this.getSpirits(),
//     };
//   }

//   getSpirits = function () {
//     return this.spirits;
//   }

//   getSpirit = function ({ id }) {
//     return { ...this.spirits.find((spirit) => spirit.id === id) };
//   }

//   getSpiritFractionsList = () => this.fractions;

//   getSpiritAbilitiesList = () => this.abilities;

//   putSpirit = ({ id, props }) => {
//     const index = this.spirits.findIndex((spirit) => spirit.id === id);
//     this.spirits[index] = {
//       ...this.spirits[index],
//       ...props,
//       id,
//     };
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//     this.emit('putSpirit', R.clone(this.spirits[index]));
//   }

//   postSpirit = ({ props }) => {
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

//   cloneSpirit = ({ id }) => {
//     const spirit = this.getSpirit({ id });
//     return this.postSpirit({
//       props: {
//         ...spirit,
//         name: this._makeSpiritName(spirit.name),
//       },
//     });
//   }

//   deleteSpirit = ({ id }) => {
//     this.spirits = this.spirits.filter((spirit) => spirit.id !== id);
//     this._updateSpiritFractionsList();
//     this._updateSpiritAbilitiesList();
//   }

//   _makeSpiritName = (name) => {
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

//   _updateSpiritFractionsList = () => {
//     const newFractions = R.without([''], R.uniq(this.spirits.map(R.prop('fraction'))));
//     if (this.fractions.length !== newFractions || R.symmetricDifference(newFractions, this.fractions).length > 0) {
//       const changeData = {
//         added: R.difference(newFractions, this.fractions),
//         removed: R.difference(this.fractions, newFractions),
//         fractions: [...this.fractions],
//       };
//       this.fractions = newFractions;
//       this.emit('fractionChange', changeData);
//     }
//   }

//   _updateSpiritAbilitiesList = () => {
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
