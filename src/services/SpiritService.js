import * as R from 'ramda';
import EventEmitter from 'events';

import { defaultSpirit } from '../types/primitives';
import { getEeStats } from '../utils/miscUtils';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export class SpiritService extends EventEmitter {
  constructor() {
    super();
    this.fractions = [];
    this.abilities = [];
    this.spirits = [];
    this.maxSpiritId = 1;
    // this.spirits = spirits || this._getLSSpirits() || [];
  }

  setData({ spirits } = {}) {
    this.spirits = spirits || [];
    this.maxSpiritId = R.reduce(R.max, 1, this.spirits.map(R.prop('id')));
    if (this.spirits.length === 0) {
      ['Иркут', 'Ангара', 'Байкал', 'Баргузин'].forEach((name) => this._postSpirit({
        props: { name },
      }));
    }
    this.spirits.filter((spirit) => spirit.maxHitPoints === undefined)
      .forEach((spirit) => (spirit.maxHitPoints = 10));
    if (spirits) {
      this._saveSpirits();
    }
    this._updateSpiritFractionsList();
    this._updateSpiritAbilitiesList();
  }

  // _getLSSpirits = function () {
  //   const spirits = localStorage.getItem('spirits');
  //   return spirits ? JSON.parse(spirits) : null;
  // }

  get(request, onDefaultRequest) {
    request = stringToType(request);
    if (request.type === 'spirits') {
      return this._getSpirits();
    }
    if (request.type === 'spirit') {
      return this._getSpirit(request);
    }
    if (request.type === 'spiritFractionsList') {
      return this._getSpiritFractionsList(request);
    }
    if (request.type === 'spiritAbilitiesList') {
      return this._getSpiritAbilitiesList(request);
    }
    return onDefaultRequest(request);
  }

  _getSpirits = function () {
    return this.spirits;
  }

  // getSpirit = function (id) {
  //   return { ...this.spirits.find((spirit) => spirit.id === id) };
  // }

  _getSpirit = function ({ id }) {
    // return this.getSpirit(id);
    return { ...this.spirits.find((spirit) => spirit.id === id) };
  }

  _getSpiritFractionsList = () => this.fractions;

  _getSpiritAbilitiesList = () => this.abilities;

  execute(action, onDefaultAction) {
    action = stringToType(action);
    if (action.type === 'putSpirit') {
      return this._putSpirit(action);
    }
    if (action.type === 'postSpirit') {
      return this._postSpirit(action);
    }
    if (action.type === 'cloneSpirit') {
      return this._cloneSpirit(action);
    }
    if (action.type === 'deleteSpirit') {
      return this._deleteSpirit(action);
    }
    return onDefaultAction(action);
  }

  _putSpirit = ({ id, props }) => {
    const index = this.spirits.findIndex((spirit) => spirit.id === id);
    this.spirits[index] = {
      ...this.spirits[index],
      ...props,
      id,
    };
    this._updateSpiritFractionsList();
    this._updateSpiritAbilitiesList();
    this.emit('putSpirit', R.clone(this.spirits[index]));
    this._saveSpirits();
  }

  _postSpirit = ({ props }) => {
    this.maxSpiritId++;
    this.spirits.push({
      ...R.clone(defaultSpirit),
      ...props,
      id: this.maxSpiritId,
      // name: String(this.maxSpiritId),
    });
    this._saveSpirits();
    this._updateSpiritFractionsList();
    this._updateSpiritAbilitiesList();
    return this.spirits[this.spirits.length - 1];
  }

  _cloneSpirit = ({ id }) => {
    // const spirit = this.getSpirit(id);
    const spirit = this.get({
      type: 'spirit',
      id,
    });
    return this._postSpirit({
      props: {
        ...spirit,
        name: this._makeSpiritName(spirit.name),
      },
    });
  }

  _deleteSpirit = ({ id }) => {
    this.spirits = this.spirits.filter((spirit) => spirit.id !== id);
    this._updateSpiritFractionsList();
    this._updateSpiritAbilitiesList();
    this._saveSpirits();
  }

  _makeSpiritName = (name) => {
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

  _updateSpiritFractionsList = () => {
    const newFractions = R.without([''], R.uniq(this.spirits.map(R.prop('fraction'))));
    if (this.fractions.length !== newFractions || R.symmetricDifference(newFractions, this.fractions).length > 0) {
      this.fractions = newFractions;
      this.emit('fractionChange', R.clone(this.fractions));
    }
  }

  _updateSpiritAbilitiesList = () => {
    const newAbilites = R.uniq(R.flatten(this.spirits.map(R.prop('abilities'))));
    if (this.abilities.length !== newAbilites || R.symmetricDifference(newAbilites, this.abilities).length > 0) {
      this.abilities = newAbilites;
      // this.emit('fractionChange', R.clone(this.fractions));
    }
  }

  _saveSpirits = function () {
    // localStorage.setItem('spirits', JSON.stringify(this.spirits));
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
