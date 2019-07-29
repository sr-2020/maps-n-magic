/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './Beacons.css';
import shortid from 'shortid';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';
import Map from '../Map';
import MapMarker from '../MapMarker';
import MapPoint from '../MapPoint';
import getPolygons from '../../utils/polygonGenerator';

export default class Beacons extends Component {
  state = {
    // beacons: [{
    //   id: shortid.generate(),
    //   x: 100,
    //   y: 100
    // }],
    // polygonData: {},
    showBeaconMarkers: true,
    showPolygonLabels: true,
    showPolygonBoundaries: true,
    // addBeacon, editPolygon
    mode: 'addBeacon',
    editingPolygon: false,
    mainPolygon: [[324.375, 80], [128.375, 370], [543.375, 560], [610.375, 454], [459.375, 414], [458.375, 302], [428.375, 301], [423.375, 135], [348.375, 79], [324.375, 80]]
  };

  componentDidMount = () => {
    console.log('Beacons mounted');
    // this.getStateInfo();
  }

  componentDidUpdate = () => {
    console.log('Beacons did update');
  }

  componentWillUnmount = () => {
    console.log('Beacons will unmount');
  }

  // getStateInfo = () => {
  //   const { dbms } = this.props;
  //   Promise.all([
  //     dbms.getSomething(),
  //   ]).then((results) => {
  //     const [something] = results;
  //     this.setState({
  //       something
  //     });
  //   });
  // }

  addBeacon = (event) => {
    // console.log(event);
    const rect = document.querySelector('svg.root-image').getBoundingClientRect();
    // const rect = event.target.getBoundingClientRect();
    // console.log(event.location);
    const eX = event.clientX;
    const eY = event.clientY;

    const { mode } = this.state;
    if (mode === 'addBeacon') {
      const newBeacon = {
        x: eX - rect.left,
        y: eY - rect.top,
        id: shortid.generate(),
        props: {
          sound: 'none'
        }
      };
      // const { svgWidth, svgHeight } = this.props;
      // svgWidth: 800,
      // svgHeight: 581,

      const { beacons, setBeacons } = this.props;

      setBeacons([...beacons, newBeacon]);
      // this.setState((state) => {
      //   const newBeacons = [...state.beacons, newBeacon];
      //   return ({
      //     // movable,
      //     beacons: newBeacons,
      //     // polygonData: getPolygons(newBeacons, svgWidth, svgHeight)
      //   });
      // });
    } else {
      this.setState((state) => {
        const x = eX - rect.left;
        const y = eY - rect.top;
        const { mainPolygon } = state;
        let newPolygon;
        if (mainPolygon.length === 0) {
          newPolygon = [[x, y]];
        } else {
          const [x1, y1] = mainPolygon[0];
          const dist = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
          if (dist < 20) {
            newPolygon = [...mainPolygon, [x1, y1]];
          } else {
            newPolygon = [...mainPolygon, [x, y]];
          }
        }

        //  = [...state.mainPolygon, newBeacon];
        return ({
          // movable,
          mainPolygon: newPolygon,
          // polygonData: getPolygons(newBeacons, svgWidth, svgHeight)
        });
      });
    }
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

  onPointChange = (index, coord) => (e) => {
    const { value } = e.target;
    const { mainPolygon } = this.state;
    const newPoint = [...mainPolygon[index]];
    newPoint[coord] = value;
    const newPolygon = [...mainPolygon];
    newPolygon[index] = newPoint;

    this.setState({
      mainPolygon: newPolygon
    });

    // const index = beacons.findIndex(beacon => beacon.id === id);
    // const beacons2 = [...beacons];
    // beacons2[index] = {
    //   ...beacons2[index],
    //   [prop]: value
    // };
    // setBeacons(beacons2);
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

  onBeaconRemove = id => (e) => {
    // const { svgWidth, svgHeight } = this.props;
    const { beacons, setBeacons } = this.props;
    const beacons2 = beacons.filter(beacon => beacon.id !== id);
    setBeacons(beacons2);
    // this.setState(({ beacons }) => {
    //   const beacons2 = beacons.filter(beacon => beacon.id !== id);
    //   return {
    //     beacons: beacons2,
    //     // polygonData: getPolygons(beacons2, svgWidth, svgHeight)
    //   };
    // });
  }

  // this.onTableHover(beacon.id)

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
    // if (mode === 'addBeacon') {
    this.setState(({
      mode
    }));
    // } else {
    //   this.setState(({
    //     mode,
    //     mainPolygon: []
    //   }));
    // }
  }

  clearPolygon = (mode) => {
    this.setState(({
      mainPolygon: []
    }));
  }

  polygon2polyline = polygon => polygon.map(pt => pt.join(',')).join(' ');

  render() {
    const {
      // beacons,
      showBeaconMarkers, showPolygonLabels, showPolygonBoundaries, hoveredBeacon, mode, mainPolygon
    } = this.state;

    // //const { t } = this.props;

    // if (!something) {
    //   return <div> Beacons stub </div>;
    //   // return null;
    // }
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, onPropChange, beacons, audioService
    } = this.props;
    console.log(beacons);
    let polygonData;
    if (showPolygonLabels || showPolygonBoundaries) {
      polygonData = getPolygons(beacons, svgWidth, svgHeight);
    }
    return (
      <div className="Beacons flex-row justify-content-center">
        <Map
          imagePositionX={imagePositionX}
          imagePositionY={imagePositionY}
          imageOpacity={imageOpacity}
          imageScale={imageScale}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          onClick={this.addBeacon}
          onMouseMove={this.moveMovable}
        >
          <defs>
            <radialGradient id="RadialGradient1">
              <stop offset="0%" stopColor="red" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>
          </defs>

          {/* onClick={this.setMovable(null)} */}
          {
            <polyline
              fill="none"
              stroke="red"
              strokeWidth="2"
              opacity="0.5"
              points={this.polygon2polyline(mainPolygon)}
            />
          }
          {
            showPolygonBoundaries && polygonData.polygons && polygonData.polygons.map((polygon, i) => (
              <Fragment>
                <polyline
                  fill={polygonData.beaconColors[i] || 'none'}
                  stroke="grey"
                  strokeWidth="2"
                  opacity="0.5"
                  points={this.polygon2polyline(polygon)}
                />
                <polyline
                  fill="none"
                  stroke="grey"
                  strokeWidth="2"
                  opacity="0.5"
                  points={this.polygon2polyline(polygon)}
                />
              </Fragment>
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
            beacons.map(beacon => (
              <circle r="40" cx={beacon.x} cy={beacon.y} opacity="0.5" fill="url(#RadialGradient1)" />
            ))
          }
          {
            beacons.map(beacon => (
              <Fragment>
                {
                  showBeaconMarkers
                    && (
                      <MapMarker
                        x={beacon.x}
                        y={beacon.y}
                        id={beacon.id}
                        color={hoveredBeacon === beacon.id ? 'blue' : beacon.color}
                        onClick={this.setMovable(beacon.id)}
                      />
                    )
                }
              </Fragment>
            ))
          }
        </Map>
        <div>
          <input
            id="showBeaconMarkersInput"
            type="checkbox"
            onChange={this.toggleCheckbox('showBeaconMarkers')}
            checked={showBeaconMarkers}
          />
          <label htmlFor="showBeaconMarkersInput">Show beacon markers</label>
          <br />
          <input
            id="showPolygonLabelsInput"
            type="checkbox"
            onChange={this.toggleCheckbox('showPolygonLabels')}
            checked={showPolygonLabels}
          />
          <label htmlFor="showPolygonLabelsInput">Show polygon labels</label>
          <br />
          <input
            id="showPolygonBoundariesInput"
            type="checkbox"
            onChange={this.toggleCheckbox('showPolygonBoundaries')}
            checked={showPolygonBoundaries}
          />
          <label htmlFor="showPolygonBoundariesInput">Show polygon boundaries</label>
          <br />
          <Button
            variant={mode === 'addBeacon' ? 'primary' : 'light'}
            onClick={this.setModeState('addBeacon')}
            className="margin-right-1rem"
          >Add beacon
          </Button>
          <Button
            variant={mode === 'editPolygon' ? 'primary' : 'light'}
            onClick={this.setModeState('editPolygon')}
            className="margin-right-1rem"
          >Edit main polygon
          </Button>
          <Button
            variant="primary"
            onClick={this.clearPolygon}
          >Clear main polygon
          </Button>

          {mode === 'editPolygon' && (
            <table className="beaconTable">
              <thead>
                <tr>
                  <th>x</th>
                  <th>y</th>
                </tr>
              </thead>
              <tbody>
                {
                  mainPolygon.map((point, i) => (
                    <tr>
                      <td>
                        <input className="coordInput" value={point[0]} type="number" onChange={this.onPointChange(i, 0)} />
                      </td>
                      <td>
                        <input className="coordInput" value={point[1]} type="number" onChange={this.onPointChange(i, 1)} />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )
          }

          {mode === 'addBeacon' && (
            <table className="beaconTable">
              <thead>
                <tr>
                  <th>id</th>
                  <th>x</th>
                  <th>y</th>
                </tr>
              </thead>
              <tbody>
                {
                  beacons.map(beacon => (
                    <tr onMouseOver={this.onTableHover(beacon.id)}>
                      <td>
                        <input value={beacon.id} onChange={this.onBeaconChange(beacon.id, 'id')} />
                      </td>
                      <td>
                        <input className="coordInput" value={beacon.x} type="number" onChange={this.onBeaconChange(beacon.id, 'x')} />
                      </td>
                      <td>
                        <input className="coordInput" value={beacon.y} type="number" onChange={this.onBeaconChange(beacon.id, 'y')} />
                      </td>
                      <td>
                        <select value={beacon.props.sound} onChange={this.onBeaconPropChange(beacon.id, 'sound')}>
                          {
                            ['none'].concat(audioService.getBuffers().map(R.prop('name'))).map(soundName => <option value={soundName}>{soundName}</option>)
                          }
                        </select>
                        {/* onChange={this.onBeaconChange(beacon.id, 'y')}  */}
                      </td>
                      <td>
                        <button type="button" onClick={this.onBeaconRemove(beacon.id)}>Remove</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

Beacons.propTypes = {
  // bla: PropTypes.string,
};

Beacons.defaultProps = {
  // bla: 'test',
};
