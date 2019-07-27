/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './Beacons.css';
import shortid from 'shortid';

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
    showPolygonBoundaries: true
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
    const newBeacon = {
      x: eX - rect.left,
      y: eY - rect.top,
      id: shortid.generate()
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
  }

  onBeaconChange = (id, prop) => (e) => {
    const { value } = e.target;
    // const { svgWidth, svgHeight } = this.props;
    // this.setState(({ beacons }) => {
    // console.log(prop);
    const { beacons, setBeacons } = this.props;
    const index = beacons.findIndex(beacon => beacon.id === id);
    const beacons2 = [...beacons];
    beacons2[index] = {
      ...beacons2[index],
      [prop]: value
    };
    setBeacons(beacons2);
    //   return {
    //     beacons: beacons2,
    //     // polygonData: getPolygons(beacons2, svgWidth, svgHeight)
    //   };
    // });
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

  render() {
    const {
      // beacons,
      showBeaconMarkers, showPolygonLabels, showPolygonBoundaries, hoveredBeacon
    } = this.state;

    // //const { t } = this.props;

    // if (!something) {
    //   return <div> Beacons stub </div>;
    //   // return null;
    // }
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, onPropChange, beacons
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
            showPolygonBoundaries && polygonData.polygons && polygonData.polygons.map((polygon, i) => (
              <Fragment>
                <polyline fill={polygonData.beaconColors[i] || 'none'} stroke="grey" strokeWidth="2" opacity="0.5" points={polygon.map(pt => pt.join(',')).join(' ')} />
                <polyline fill="none" stroke="grey" strokeWidth="2" opacity="0.5" points={polygon.map(pt => pt.join(',')).join(' ')} />
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
                      <input value={beacon.x} type="number" onChange={this.onBeaconChange(beacon.id, 'x')} />
                    </td>
                    <td>
                      <input value={beacon.y} type="number" onChange={this.onBeaconChange(beacon.id, 'y')} />
                    </td>
                    <td>
                      <button type="button" onClick={this.onBeaconRemove(beacon.id)}>Remove</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
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
