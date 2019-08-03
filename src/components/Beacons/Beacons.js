/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, Fragment } from 'react';
import './Beacons.css';
import shortid from 'shortid';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Map from '../Map';
import MapMarker from '../MapMarker';
import MapPoint from '../MapPoint';
import getPolygons from '../../utils/polygonGenerator';

import BeaconTable from './BeaconTable';
import PolygonTable from './PolygonTable';
import SettingsForm from './SettingsForm';
import MainPolygon from '../MainPolygon';

import ColorPalette from '../../utils/colorPalette';

import { polygon2polyline, euDist } from '../../utils/polygonUtils';

let tracks = [];

export default class Beacons extends Component {
  state = {
    showBeaconMarkers: true,
    showPolygonLabels: false,
    showPolygonBoundaries: true,
    showBeaconSignalArea: false,
    showMassCenters: true,
    showTracks: true,
    enableAutoIteration: false,
    maxDelta: 1,
    signalRadius: 40,
    // addBeacon, editPolygon
    mode: 'addBeacon',
    // editingPolygon: false,
    // mainPolygon: [[324.375, 80], [128.375, 370], [543.375, 560], [610.375, 454], [459.375, 414], [458.375, 302], [428.375, 301], [423.375, 135], [348.375, 79], [324.375, 80]],
    // tracks: []
  };

  getClickCoords = (event) => {
    const rect = document.querySelector('svg.root-image').getBoundingClientRect();
    const eX = event.clientX;
    const eY = event.clientY;
    const x = Math.round(eX - rect.left);
    const y = Math.round(eY - rect.top);
    return { x, y };
  }

  addBeacon = (event) => {
    const { x, y } = this.getClickCoords(event);

    const newBeacon = {
      x,
      y,
      id: shortid.generate(),
      props: {
        sound: 'none'
      }
    };

    const { beacons, setBeacons } = this.props;
    tracks = [];
    setBeacons([...beacons, newBeacon]);
  }

  addMainPolygonPoint = (event) => {
    const { x, y } = this.getClickCoords(event);
    const { mainPolygon, setMainPolygon } = this.props;
    let newPoint = [x, y];
    if (mainPolygon.length > 0) {
      const [x1, y1] = mainPolygon[0];

      const dist = euDist({ x, y }, { x: x1, y: y1 });
      if (dist < 20) {
        newPoint = [x1, y1];
      }
      // if (x1[0] === x[0] && y1[1] === y[1]) {
      //   return;
      // }
    }
    let polygon = mainPolygon;
    if (mainPolygon.length > 1) {
      const first = mainPolygon[0];
      const last = mainPolygon[mainPolygon.length - 1];
      if (first[0] === last[0] && first[1] === last[1]) {
        polygon = [];
      }
    }
    setMainPolygon([...polygon, newPoint]);
  }

  onBeaconChange = (id, prop) => (e) => {
    const { value } = e.target;
    const { beacons, setBeacons } = this.props;
    const index = beacons.findIndex(beacon => beacon.id === id);
    const beacons2 = [...beacons];
    beacons2[index] = {
      ...beacons2[index],
      [prop]: value
    };
    setBeacons(beacons2);
  }

  onMainPolygonPointChange = (index, coord) => (e) => {
    const { value } = e.target;
    const { mainPolygon, setMainPolygon } = this.props;
    const newPoint = [...mainPolygon[index]];
    newPoint[coord] = Number(value);
    const newPolygon = [...mainPolygon];
    newPolygon[index] = newPoint;

    setMainPolygon(newPolygon);
  }

  onBeaconPropChange = (id, prop) => (e) => {
    const { value } = e.target;
    const { beacons, setBeacons } = this.props;
    const index = beacons.findIndex(beacon => beacon.id === id);
    const beacons2 = [...beacons];
    beacons2[index] = {
      ...beacons2[index],
      props: {
        ...beacons2[index].props,
        [prop]: value
      }
    };
    setBeacons(beacons2);
  }

  onBeaconPropCheckboxChange = (id, prop) => (e) => {
    const { checked } = e.target;
    const { beacons, setBeacons } = this.props;
    const index = beacons.findIndex(beacon => beacon.id === id);
    const beacons2 = [...beacons];
    beacons2[index] = {
      ...beacons2[index],
      props: {
        ...beacons2[index].props,
        [prop]: checked
      }
    };
    setBeacons(beacons2);
  }

  onBeaconRemove = id => (e) => {
    const { beacons, setBeacons } = this.props;
    const beacons2 = beacons.filter(beacon => beacon.id !== id);
    tracks = [];
    setBeacons(beacons2);
  }

  onTableHover = id => (e) => {
    this.setState({
      hoveredBeacon: id
    });
  }

  setMovable = id => (event) => {
    event.stopPropagation();
    // console.log('setMovable', id);
    // console.log(state.movableId == null, (state.movableId == null ? null : id));
    this.setState(state => ({
      movableId: (state.movableId == null ? id : null)
    }));
  };

  moveMovable = (event) => {
    const rect = document.querySelector('svg.root-image').getBoundingClientRect();
    // const rect = event.target.getBoundingClientRect();
    // console.log(event.location);
    const eX = event.clientX;
    const eY = event.clientY;
    const movable = {
      x: eX - rect.left,
      y: eY - rect.top
    };
    // const { svgWidth, svgHeight } = this.props;
    this.setState((state) => {
      if (state.movableId == null) return null;

      const { beacons, setBeacons } = this.props;

      // console.log(state.movableId);
      const beacons2 = beacons.map((beacon) => {
        if (beacon.id !== state.movableId) return beacon;
        return {
          ...beacon,
          ...movable
        };
      });

      setBeacons(beacons2);

      return {
        movable,
        // beacons: beacons2,
        // polygonData: getPolygons(beacons, svgWidth, svgHeight)
      };
    });
  }

  toggleCheckbox = prop => () => {
    this.setState(state => ({
      [prop]: !state[prop]
    }));
  }

  setModeState = mode => () => {
    this.setState(({
      mode
    }));
  }

  clearMainPolygon = (mode) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.setMainPolygon([]);
  }

  clearBeacons = (mode) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.setBeacons([]);
  }

  clearTracks = (mode) => {
    tracks = [];
  }

  autoIteration = (start) => {
    if (start) {
      setTimeout(() => this.nextIteration(), 200);
    }
  }

  nextIteration = () => {
    const {
      svgWidth, svgHeight, beacons, setBeacons, mainPolygon
    } = this.props;
    const {
      maxDelta
    } = this.state;

    const polygonData = getPolygons(beacons, svgWidth, svgHeight, mainPolygon);
    // console.log('beacons', beacons);
    // console.log('polygonData.clippedCenters', polygonData.clippedCenters);

    const { clippedCenters } = polygonData;

    const newBeacons = beacons.map((beacon) => {
      const center = clippedCenters.find(center2 => center2.id === beacon.id);
      return {
        ...beacon,
        x: beacon.props.positionFixed ? beacon.x : center.x,
        y: beacon.props.positionFixed ? beacon.y : center.y,
      };
    });

    const delta = beacons.reduce((delta2, beacon, i) => {
      const { x: x1, y: y1 } = beacon;
      const { x: x2, y: y2 } = newBeacons[i];

      delta2 += Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      return delta2;
    }, 0);
    if (delta < maxDelta) {
      this.setState({
        enableAutoIteration: false
      });
    } else {
      tracks.push(R.clone(newBeacons));
      setBeacons(newBeacons);
    }
  }

  onStateChange = prop => (e) => {
    // console.log('prop');
    this.setState({
      [prop]: e.target.value
    });
  }

  tracks2Polylines = () => {
    if (tracks.length === 0) return [];
    const arr = tracks[0];
    return arr.map((pt, i) => tracks.map(trackArr => trackArr[i]).map(obj => [obj.x, obj.y])).map(polygon2polyline);
  }

  render() {
    const {
      showBeaconMarkers, showPolygonLabels, showPolygonBoundaries,
      hoveredBeacon, mode, showBeaconSignalArea, showMassCenters,
      enableAutoIteration, maxDelta, signalRadius, showTracks
    } = this.state;

    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale,
      svgWidth, svgHeight, onPropChange, beacons, audioService, mainPolygon, imageUrl
    } = this.props;
    // console.log(beacons);
    let polygonData;
    this.autoIteration(enableAutoIteration);
    if (showPolygonLabels || showPolygonBoundaries) {
      polygonData = getPolygons(beacons, svgWidth, svgHeight, mainPolygon);
    }
    const trackLines = this.tracks2Polylines();
    // console.log('trackLines', trackLines);
    return (
      <div className="Beacons flex-row justify-content-center">
        <Map
          imagePositionX={imagePositionX}
          imagePositionY={imagePositionY}
          imageOpacity={imageOpacity}
          imageScale={imageScale}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          imageUrl={imageUrl}
          onClick={mode === 'addBeacon' ? this.addBeacon : this.addMainPolygonPoint}
          onMouseMove={this.moveMovable}
        >
          <defs>
            <radialGradient id="RadialGradient1">
              <stop offset="0%" stopColor="red" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>
          </defs>

          <MainPolygon mainPolygon={mainPolygon} />

          {
            showPolygonBoundaries && polygonData.clippedPolygons
              && polygonData.clippedPolygons.map((polygons, i) => polygons.map(polygon => (
                <Fragment>
                  <polyline
                    fill={polygonData.beaconColors[i] || ColorPalette[i % ColorPalette.length].color.background || 'none'}
                    stroke="grey"
                    strokeWidth="2"
                    opacity="0.5"
                    points={polygon2polyline(polygon)}
                  />
                  <polyline
                    fill="none"
                    stroke="grey"
                    strokeWidth="2"
                    opacity="0.5"
                    points={polygon2polyline(polygon)}
                  />
                </Fragment>
              )))
          }
          {
            showTracks && trackLines.map(trackLine => (
              <polyline
                fill="none"
                stroke="black"
                strokeWidth="1"
                opacity="0.5"
                points={trackLine}
              />
            ))
          }
          {
            showPolygonLabels && polygonData.polygonCenters && polygonData.polygonCenters.map((center, i) => (
              <Fragment>
                <text x={center.x} y={center.y + 5} fontSize="15" textAnchor="middle" fill="black">{center.id}</text>
              </Fragment>
            ))
          }
          {
            beacons.map(beacon => (
              <MapPoint x={beacon.x} y={beacon.y} />
            ))
          }
          {
            showMassCenters && polygonData && polygonData.clippedCenters && polygonData.clippedCenters.map((center, i) => (
              <MapPoint x={center.x} y={center.y} fill="black" />
            ))
          }
          {
            showBeaconSignalArea && beacons.map(beacon => (
              <circle r={signalRadius} cx={beacon.x} cy={beacon.y} opacity="0.5" fill="url(#RadialGradient1)" />
            ))
          }
          {
            showBeaconMarkers && beacons.map(beacon => (
              <MapMarker
                x={beacon.x}
                y={beacon.y}
                id={beacon.id}
                color={hoveredBeacon === beacon.id ? 'blue' : beacon.color}
                onClick={this.setMovable(beacon.id)}
              />
            ))
          }
        </Map>
        <div>
          <SettingsForm
            showBeaconMarkers={showBeaconMarkers}
            showPolygonLabels={showPolygonLabels}
            showPolygonBoundaries={showPolygonBoundaries}
            showMassCenters={showMassCenters}
            showBeaconSignalArea={showBeaconSignalArea}
            showTracks={showTracks}
            signalRadius={signalRadius}
            enableAutoIteration={enableAutoIteration}
            maxDelta={maxDelta}

            toggleCheckbox={this.toggleCheckbox}
            onStateChange={this.onStateChange}
            nextIteration={this.nextIteration}
            clearPolygon={this.clearMainPolygon}
            clearBeacons={this.clearBeacons}
            clearTracks={this.clearTracks}
          />

          <Form.Check
            type="radio"
            id="addBeaconRadio"
            label="Add beacon mode"
            value="addBeacon"
            name="mode-radio"
            checked={mode === 'addBeacon'}
            onClick={this.setModeState('addBeacon')}
          />

          <Form.Check
            type="radio"
            id="editPolygonRadio"
            value="editPolygon"
            name="mode-radio"
            label="Edit main polygon mode"
            checked={mode !== 'addBeacon'}
            onClick={this.setModeState('editPolygon')}
          />
          <br />

          {mode === 'editPolygon' && (
            <PolygonTable
              mainPolygon={mainPolygon}
              onPointChange={this.onMainPolygonPointChange}
            />
          )}

          {mode === 'addBeacon' && (
            <BeaconTable
              audioService={audioService}
              beacons={beacons}
              onTableHover={this.onTableHover}
              onBeaconChange={this.onBeaconChange}
              onBeaconPropChange={this.onBeaconPropChange}
              onBeaconPropCheckboxChange={this.onBeaconPropCheckboxChange}
              onBeaconRemove={this.onBeaconRemove}
            />
          )}
        </div>
      </div>
    );
  }
}
