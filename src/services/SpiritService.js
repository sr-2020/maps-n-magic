import * as R from 'ramda';
import EventEmitter from 'events';

import { defaultSpirit } from '../types/primitives';
import { getEeStats } from '../utils/miscUtils';

export class SpiritService extends EventEmitter {
  constructor({ spirits } = {}) {
    super();
    this.fractions = [];
    this.abilities = [];
    this.spirits = spirits || this._getLSSpirits() || [];
    this.maxSpiritId = R.reduce(R.max, 1, this.spirits.map(R.prop('id')));
    if (this.spirits.length === 0) {
      ['Иркут', 'Ангара', 'Байкал', 'Баргузин'].forEach((name) => this.postSpirit({ name }));
    }
    this.spirits.filter((spirit) => spirit.maxHitPoints === undefined)
      .forEach((spirit) => (spirit.maxHitPoints = 10));
    if (spirits) {
      this._saveSpirits();
    }
    this.updateSpiritFractionsList();
    this.updateSpiritAbilitiesList();
  }

  _getLSSpirits = function () {
    const spirits = localStorage.getItem('spirits');
    return spirits ? JSON.parse(spirits) : null;
  }

  getSpirits = function () {
    return this.spirits;
  }

  getSpirit = function (id) {
    return { ...this.spirits.find((spirit) => spirit.id === id) };
  }

  putSpirit = (id, props) => {
    const index = this.spirits.findIndex((spirit) => spirit.id === id);
    this.spirits[index] = {
      ...this.spirits[index],
      ...props,
      id,
    };
    this.updateSpiritFractionsList();
    this.updateSpiritAbilitiesList();
    this.emit('putSpirit', R.clone(this.spirits[index]));
    this._saveSpirits();
  }

  postSpirit = (props) => {
    this.maxSpiritId++;
    this.spirits.push({
      ...R.clone(defaultSpirit),
      ...props,
      id: this.maxSpiritId,
      // name: String(this.maxSpiritId),
    });
    this._saveSpirits();
    this.updateSpiritFractionsList();
    this.updateSpiritAbilitiesList();
    return this.spirits[this.spirits.length - 1];
  }

  cloneSpirit = (id) => {
    const spirit = this.getSpirit(id);
    return this.postSpirit({
      ...spirit,
      name: this.makeSpiritName(spirit.name),
    });
  }

  makeSpiritName = (name) => {
    const spiritMap = R.indexBy(R.prop('name'), this.spirits);
    const base = `${name} клон`;
    let newName = base;
    let counter = 1;
    // eslint-disable-next-line eqeqeq
    while (spiritMap[newName] != undefined) {
      newName = `${base} ${counter}`;
      counter++;
    }
    return newName;
  }

  deleteSpirit = (id) => {
    this.spirits = this.spirits.filter((spirit) => spirit.id !== id);
    this.updateSpiritFractionsList();
    this.updateSpiritAbilitiesList();
    this._saveSpirits();
  }

  updateSpiritFractionsList = () => {
    const newFractions = R.without([''], R.uniq(this.spirits.map(R.prop('fraction'))));
    if (this.fractions.length !== newFractions || R.symmetricDifference(newFractions, this.fractions).length > 0) {
      this.fractions = newFractions;
      this.emit('fractionChange', R.clone(this.fractions));
    }
  }

  updateSpiritAbilitiesList = () => {
    const newAbilites = R.uniq(R.flatten(this.spirits.map(R.prop('abilities'))));
    if (this.abilities.length !== newAbilites || R.symmetricDifference(newAbilites, this.abilities).length > 0) {
      this.abilities = newAbilites;
      // this.emit('fractionChange', R.clone(this.fractions));
    }
  }

  getSpiritFractionsList = () => this.fractions;

  getSpiritAbilitiesList = () => this.abilities;

  _saveSpirits = function () {
    localStorage.setItem('spirits', JSON.stringify(this.spirits));
  }

  // on(...args) {
  //   const res = super.on.apply(this, args);
  //   console.log('on', getEeStats(this));
  //   return res;
  // }

  // off(...args) {
  //   const res = super.off.apply(this, args);
  //   console.log('off', getEeStats(this));
  //   return res;
  // }
}
