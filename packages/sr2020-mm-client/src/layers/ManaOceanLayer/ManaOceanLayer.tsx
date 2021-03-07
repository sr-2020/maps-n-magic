import React, { Component } from 'react';
import { WithLocationRecords } from '../../dataHOCs';
import { WithTranslation } from "react-i18next";
import { L, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import moment from 'moment-timezone';
import './ManaOceanLayer.css';

import { 
  isGeoLocation, 
  getArrDiff, 
  LocationRecord,
  LocationRecordOptions,
  ArrDiff,
  ArrDiffUpdate,
  GameModel,
  ManaOceanEffect,
  RitualLocationEffect
} from 'sr2020-mm-event-engine';

import { LocationPopup } from './LocationPopup';

import { 
  ManaOceanLocation,
  manaOceanLocation
} from "../../types";

// const manaFillColors = { // based on h202
//   1: 'white', // hsla(202, 60%, 90%, 1)
//   2: '#c4deee', // hsla(202, 55%, 85%, 1)
//   3: '#7dc1e8', // hsla(202, 70%, 70%, 1)
//   4: '#2ba6ee', // hsla(202, 85%, 55%, 1)
//   5: '#0081cc', // hsla(202, 100%, 40%, 1)
// };

const manaFillColors = { // based on h202
  1: '#ee2b45', // hsla(352, 85%, 55%, 1)
  2: '#e87d8b', // hsla(352, 70%, 70%, 1)
  3: '#eec4c9', // hsla(352, 55%, 85%, 1)
  4: 'white',
  5: '#c4deee', // hsla(202, 55%, 85%, 1)
  6: '#7dc1e8', // hsla(202, 70%, 70%, 1)
  7: '#2ba6ee', // hsla(202, 85%, 55%, 1)
};

const defaultColor = 'black';

const isNotEmptyPolygon = R.pipe(
  R.prop('polygon'),
  R.equals({}),
  R.not,
);

const filterLocationRecords = R.pipe(
  R.filter(isGeoLocation),
  R.filter(isNotEmptyPolygon),
);

function hasLocationDifference(item: LocationRecord, prevItem: LocationRecord) {
  // polygon, label, options.manaLevel
  return !R.equals(item.polygon, prevItem.polygon)
    || !R.equals(item.label, prevItem.label)
    || !R.equals(item.options.effectList, prevItem.options.effectList)
    || item.options.manaLevel !== prevItem.options.manaLevel;
}

function isPermanentEffect(effect: ManaOceanEffect): effect is RitualLocationEffect {
  return (effect as RitualLocationEffect).permanent === true;
}

interface ManaOceanLayerProps {
  enableByDefault: boolean;
  gameModel: GameModel;
}
interface ManaOceanLayerState {
  curLocation: {
    id: number;
    locOptions: LocationRecordOptions
  } | null;
}

export class ManaOceanLayer extends Component<
  ManaOceanLayerProps &
  WithLocationRecords &
  WithTranslation &
  CommonLayerProps,
  ManaOceanLayerState
> {
  locationPopupDom: HTMLElement;
  locationPopup: L.Popup;

  group = L.layerGroup([]);

  nameKey = 'manaOceanLayer';

  constructor(props) {
    super(props);
    this.state = {
      curLocation: null,
    };
    this.createLocation = this.createLocation.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.getLocationTooltip = this.getLocationTooltip.bind(this);
    this.onLocationClick = this.onLocationClick.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, locationRecords,
    } = this.props;
    // this.subscribe('on', gameModel);
    // this.manaOceanLayer = new InnerManaOceanLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateLocations({
      added: filterLocationRecords(locationRecords),
    });
    this.locationPopupDom = document.createElement('div');
    this.locationPopup = L.popup();
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps: WithLocationRecords) {
    const {
      locationRecords,
    } = this.props;
    if (prevProps.locationRecords !== locationRecords) {
      const diff = getArrDiff<LocationRecord>(
        filterLocationRecords(locationRecords),
        filterLocationRecords(prevProps.locationRecords),
        R.prop('id'),
        hasLocationDifference,
      );
      this.updateLocations(diff);
    //   this.subscribe('off', prevProps.gameModel);
    //   this.subscribe('on', gameModel);
    //   this.clear();
    //   this.populate();
    }
    // if (prevProps.translator !== translator) {
    //   // this.clear();
    //   // this.populate();
    // }
    console.log('InnerManaOceanLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    console.log('InnerManaOceanLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateLocations({ added = [], removed = [], updated = [] }: Partial<ArrDiff<LocationRecord>>) {
    R.map(this.createLocation, added);
    R.map(this.updateLocation, updated);
    R.map(this.removeLocation, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  updateLocation({ item }: ArrDiffUpdate<LocationRecord>) {
    // const { t } = this.props;
    const loc = this.group.getLayers().find((loc2: ManaOceanLocation) => loc2.options.id === item.id) as ManaOceanLocation;
    loc.setLatLngs([item.polygon[0]]);
    const { manaLevel } = item.options;
    loc.setStyle({ fillColor: manaFillColors[manaLevel] || defaultColor });
    L.Util.setOptions(loc, { label: item.label, locOptions: item.options });
    const that = this;
    loc.on('mouseover', function (this: ManaOceanLocation, e) {
      loc.bindTooltip(that.getLocationTooltip(this.options.label, item.options, item.id));
      this.openTooltip();
    });
  }

  createLocation(locationData: LocationRecord) {
    const {
      polygon, label, id, layer_id, options,
    } = locationData;
    // const { t, translator } = this.props;
    // const manaLevel = (id % 5) + 1;
    // const manaLevel = 5;
    // const manaLevel = 1;
    // const loc = L.polygon([polygon[0]], {
    const loc = manaOceanLocation([polygon[0]], {
      // id, label, layer_id, color: options.color, weight: options.weight, fillOpacity: options.fillOpacity,
      // id, label, layer_id, color: '#2d3748', weight: 2, dashArray: [10], fillColor: manaFillColors[manaLevel], fillOpacity: 1,
      id, label, layer_id, color: '#1a202c', locOptions: options, weight: 2, dashArray: [7], fillColor: manaFillColors[options.manaLevel] || defaultColor, fillOpacity: 1,
    });
    const that = this;
    loc.on({
      click: this.onLocationClick,
    });
    loc.on('mouseover', function (this: ManaOceanLocation, e) {
      loc.bindTooltip(that.getLocationTooltip(this.options.label, options, locationData.id));
      this.openTooltip();
    });
    loc.on('mouseout', function (this: ManaOceanLocation, e) {
      this.closeTooltip();
    });
    this.group.addLayer(loc);
  }

  // eslint-disable-next-line max-lines-per-function
  getLocationTooltip(label: string, locOptions: LocationRecordOptions, locId: number) {
    const { t } = this.props;
    // const { effects = [] } = locOptions.manaLevelModifiers;
    const { effectList = [] } = locOptions;
    let output = [`${label} (${locId})`, t('manaLevelNumber', { manaLevel: locOptions.manaLevel })];
    // const strings = effects.map(({ type, manaLevelChange }) => t(`manaEffect_${type}`, { manaLevelChange }));

    // const effectGroups1 = R.groupBy(R.prop('type'), effects);

    // const strings = R.sortBy(R.identity, R.keys(effectGroups1)).map((effectType) => {
    //   const firstEffect = effectGroups1[effectType][0];
    //   const str = t(`manaEffect_${effectType}`, { manaLevelChange: firstEffect.manaLevelChange });
    //   const { length } = effectGroups1[effectType];
    //   return `${str} x${length}, мана ${firstEffect.manaLevelChange * length}`;
    // });

    // if (strings.length > 0) {
    //   output = output.concat(strings);
    // }

    const effectGroups = R.groupBy(R.prop('type'), effectList);

    const strings2 = R.sortBy(R.identity, R.keys(effectGroups)).map((effectType) => {
      const timeArr = effectGroups[effectType].map((effect) => {
        const { start } = effect;
        const startStr = moment(start).format('HH:mm');
        if (isPermanentEffect(effect)) {
          return startStr;
        } else {
          const { end } = effect;
          const endStr = moment(end).format('HH:mm');
          return `${startStr}-${endStr}`;
        }
      });

      const firstEffect = effectGroups[effectType][0];
      // @ts-ignore
      const str = t(`manaEffect_${effectType}`, { manaLevelChange: firstEffect.manaLevelChange });
      const timeSubArr = R.take(3, timeArr);
      const timeStr = timeSubArr.join(', ') + (timeArr.length > timeSubArr.length ? ', ...' : '');
      const { length } = effectGroups[effectType];
      return `${str}, x${length} (${timeStr}), мана ${firstEffect.manaLevelChange * length}`;
    });

    // const strings2 = effectList.map(({
    //   type, manaLevelChange, start, end, permanent,
    // }) => {
    //   const str = t(`manaEffect_${type}`, { manaLevelChange });
    //   const startStr = moment(start).format('HH:mm');
    //   if (permanent) {
    //     return `${str}, ${startStr}, мана ${manaLevelChange}`;
    //   }
    //   const endStr = moment(end).format('HH:mm');
    //   return `${str}, ${startStr}-${endStr}, мана ${manaLevelChange}`;
    // });
    //     end: 1602289691729
    // id: "gRSQuMVdM"
    // manaLevelChange: 1
    // start: 1602289676729
    // type: "massacre"
    if (strings2.length > 0) {
      output = output.concat(['', ...strings2]);
    }
    return output.join('<br/>');
  }

  removeLocation(locationData: LocationRecord) {
    const location = this.group.getLayers().find((loc2: ManaOceanLocation) => loc2.options.id === locationData.id);
    this.group.removeLayer(location);
  }

  onLocationClick = (e) => {
    const { layerCommunicator } = this.props;
    const {
      id, locOptions,
    } = e.target.options;
    this.setState({
      curLocation: {
        id, locOptions,
      },
    });
    layerCommunicator.emit('openPopup', {
      popup: this.locationPopup.setLatLng(e.latlng).setContent(this.locationPopupDom),
    });
  }

  getLocationPopup() {
    const {
      curLocation,
    } = this.state;
    const {
      gameModel, locationRecords,
    } = this.props;
    if (!curLocation) {
      return null;
    }
    const record = locationRecords.find((record2) => record2.id === curLocation.id);
    if (!record) {
      return null;
    }
    return (
      <LocationPopup
        id={curLocation.id}
        locOptions={record.options}
        gameModel={gameModel}
        onClose={this.closePopup}
        locationPopupDom={this.locationPopupDom}
      />
    );
  }

  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  render() {
    return (
      <>
        {
          this.getLocationPopup()
        }
      </>
    );
  }
}
