import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './Prototype1.css';
import * as R from 'ramda';
import { Delaunay } from 'd3-delaunay';

import beacons from '../../data/beacons.json';
import players from '../../data/players.json';

import { animate, Timing } from '../../utils/animation';
import { initSound } from '../../utils/audioDataUtils';
import {
  startSounds, stopSounds, applyVolumes, computeVolumesByDistance
} from '../../utils/audioPlaybackUtils';
import { getPointMassCenter, getPerimeterMassCenter, getSolidMassCenter } from '../../utils/polygonUtils';

const SVG_WIDTH = 500;
const SVG_HEIGHT = 400;

const imageCenter = {
  x: SVG_WIDTH / 2,
  y: SVG_HEIGHT / 2,
};

const beaconCenter = beacons.reduce((acc, beacon) => {
  acc.x += beacon.x;
  acc.y += beacon.y;
  return acc;
}, { x: 0, y: 0 });

beaconCenter.x /= beacons.length;
beaconCenter.y /= beacons.length;

const correctedBeacons = beacons.map((beacon, i) => ({
  ...beacon,
  x: beacon.x + imageCenter.x - beaconCenter.x,
  y: beacon.y + imageCenter.y - beaconCenter.y,
  color: ['red', 'green', 'blue'][i % 4]
}));

function getPolygons(beacons) {
  const points = beacons.map(beacon => [beacon.x, beacon.y]);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, SVG_WIDTH, SVG_HEIGHT]);

  const polygons = [];
  for (const polygon of voronoi.cellPolygons()) {
    polygons.push(polygon);
    // console.log(polygon);
  }
  return {
    delaunay,
    polygons,
    beaconIds: beacons.map(R.prop('id')),
    beaconColors: beacons.map(R.prop('color')),
    polygonCenters: polygons.map(getSolidMassCenter).map((data, i) => ({
      ...data,
      id: beacons[i].id
    }))
  };
}

const sortBeacons = R.pipe(R.sortBy(R.prop('x')), R.sortBy(R.prop('y')));

export default class App extends Component {
  state = {
    beacons: sortBeacons(correctedBeacons),
    polygonData: getPolygons(correctedBeacons),
    sounds: [
      {
        x: 50,
        y: 100,
        soundR: 200,
        color: 'crimson',
        name: 'drums'
      },
      {
        x: 250,
        y: 300,
        soundR: 150,
        color: 'grey',
        name: 'techno'
      },
      {
        x: 450,
        y: 100,
        soundR: 250,
        color: 'green',
        name: 'organ'
      }],
    players,
    playing: false,
    movePlayers: true,
    soundsLoaded: false,
    movableId: null,
    showBeaconMarkers: false,
    listenPlayer: players[0].id
  };

  componentDidMount() {
    initSound(() => {
      this.setState({
        soundsLoaded: true
      });
    });
    this.animatePlayer();
  }

  animatePlayer = (duration) => {
    const that = this;
    animate({
      duration: 20000,
      timing: Timing.makeEaseInOut(Timing.linear),
      draw(progress) {
        that.setState((state) => {
          if (!state.movePlayers) {
            return null;
          }
          const newState = {
            ...state,
            players: state.players.map((player, i) => ({
              ...player,
              x: player.startX + Math.cos(progress * 2 * Math.PI) * (100 + i * 25),
              y: player.startY + Math.sin(progress * 2 * Math.PI) * (i % 2 == 0 ? 1 : -1) * (100 - i * 25)
            })),
            // players: [{
            //   x: 200 + Math.cos(progress*2 * Math.PI) * 100,
            //   y: 150 + Math.sin(progress*2 * Math.PI) * 100
            // }],
            sounds: [...state.sounds]
          };
          if (state.playing) {
            that.crossfade(newState);
          }
          return newState;
        });
      },
      loop: true
    });
  }

  toggleMusic = () => {
    this.setState((state) => {
      state.playing ? this.stop() : this.play();
      return {
        playing: !state.playing
      };
    });
  };

  togglePlayerMove = () => {
    this.setState(state => ({
      movePlayers: !state.movePlayers
    }));
  };

  play = () => {
    startSounds(this.state.sounds.map(R.prop('name')));
    this.crossfade(this.state);
  }

  stop = () => {
    stopSounds();
  }

  crossfade = (state) => {
    const player = state.players.find(player => player.id === state.listenPlayer);

    const arrId = state.polygonData.delaunay.find(player.x, player.y);
    const id = state.polygonData.beaconIds[arrId];
    // console.log(id);

    const beacon = state.beacons.find(beacon => beacon.id === id);
    // console.log(beacon);

    const volumes = state.sounds.map((sound) => {
      if ((sound.name === 'drums' && beacon.color === 'blue')
      || (sound.name === 'techno' && beacon.color === 'red')
      || (sound.name === 'organ' && beacon.color === 'green')
      ) {
        return {
          name: sound.name,
          gain: 1
        };
      }
      return {
        name: sound.name,
        gain: 0
      };
    });

    // const volumes = computeVolumesByDistance(state);
    applyVolumes(volumes);
  };

  onMusic = () => {
    this.toggleMusic();
  }

  onPlayerMove = (event) => {
    this.togglePlayerMove();
  }
  // onChange = (event) => {
  //   const {value} = event.target;
  //   // const event2 = event;
  //   this.setState(state => {
  //     this.crossfade(state);
  //     return {
  //       player: {...state.player, x: value*SVG_WIDTH},
  //       sounds: state.sounds
  //     };
  //   });
  // }

  listenStub = type => event => console.log(type, event);

  toggleBeaconMarker = () => {
    this.setState(state => ({
      showBeaconMarkers: !state.showBeaconMarkers
    }));
  }

  setMovable = id => (event) => {
    event.stopPropagation();
    // console.log('setMovable', id);
    this.setState(state =>
      // console.log(state.movableId == null, (state.movableId == null ? null : id));
      ({
        movableId: (state.movableId == null ? id : null)
      }));
  };

  // clearMovable = (id) => (event) => {
  //   console.log('clearMovable', id);
  //   this.setState({
  //     movableId: null
  //   })
  // };
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
    this.setState((state) => {
      if (state.movableId == null) return null;

      // console.log(state.movableId);
      const beacons = state.beacons.map((beacon) => {
        if (beacon.id !== state.movableId) return beacon;
        return {
          ...beacon,
          ...movable
        };
      });

      return {
        movable,
        beacons,
        polygonData: getPolygons(beacons)
      };
    });
  }

  onStateChange = prop => (e) => {
    this.setState({
      [prop]: e.target.value
    });
  }
  // listenStub = (type) => (event) => console.log(type, event);

  render() {
    const {
      sounds, players, playing, soundsLoaded, beacons, polygonData, movable, showBeaconMarkers, movePlayers, listenPlayer
    } = this.state;

    return (
      <div className="Prototype1">
        <input id="showBeaconMarkersInput" type="checkbox" onChange={this.toggleBeaconMarker} checked={showBeaconMarkers} />
        <label htmlFor="showBeaconMarkersInput">Show beacon markers</label>
        <br />

        {/* <button onClick={this.onPlayerMove}>Move/Stop Players</button> */}
        <input id="movePlayersInput" type="checkbox" onChange={this.onPlayerMove} checked={movePlayers} />
        <label htmlFor="movePlayersInput">Move players</label>
        <br />

        <input id="enableMusicInput" type="checkbox" onChange={this.onMusic} checked={playing} disabled={!soundsLoaded} />
        <label htmlFor="enableMusicInput">Enable music</label>
        <br />
        <label>Listen player</label>
        <select
          onChange={this.onStateChange('listenPlayer')}
          value={listenPlayer}
        >
          {/* <option value="">No value</option> */}
          {players.map((el, i) => <option value={el.id}>{`${el.id}(${el.color})`}</option>)}
        </select>
        <div>
          {!soundsLoaded ? 'loading sounds...' : 'sounds loaded'}
          {' '}
        </div>
        <br />
        <svg
          className="root-image"
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={this.moveMovable}
          onClick={this.setMovable(null)}
        >
          {/* onMouseMove={this.listenStub('onMouseMove')} */}
          {
            polygonData.polygons.map((polygon, i) => (
              <Fragment>
                <polyline fill={polygonData.beaconColors[i] || 'none'} stroke="grey" strokeWidth="2" opacity="0.5" points={polygon.map(pt => pt.join(',')).join(' ')} />
                <polyline fill="none" stroke="grey" strokeWidth="2" opacity="0.5" points={polygon.map(pt => pt.join(',')).join(' ')} />
                {/* <circle r="2" cx={polygon.map()x} cy={beacon.y} fill="green"/> */}
                {/* <circle r={sound.soundR} cx={sound.x} cy={sound.y} fill={sound.color} opacity="0.2"/> */}
              </Fragment>
            ))
          }
          {
            polygonData.polygonCenters.map((center, i) => (
              <Fragment>
                {/* <circle r="2" cx={center.x} cy={center.y} fill="black"/> */}
                <text x={center.x} y={center.y + 5} fontSize="15" textAnchor="middle" fill="black">{center.id}</text>
              </Fragment>
            ))
          }
          {
            beacons.map(beacon => (
              <Fragment>
                <circle r="2" cx={beacon.x} cy={beacon.y} fill="grey" />

                {
                  showBeaconMarkers
                    && (
                      <g
                        transform={`translate(${beacon.x - 40 / 4},${beacon.y - 70 / 2}) scale(0.5)`}
                        onClick={this.setMovable(beacon.id)}
                      >
                        {/* onMouseDown={this.setMovable(beacon.id)}
                      onMouseUp={this.clearMovable}  */}
                        <svg
                          version="1.1"
                          baseProfile="full"
                          width="40"
                          height="70"
                          viewBox="0 0 40 70"
                          xmlns="http://www.w3.org/2000/svg"
                        >

                          <circle
                            cx="20"
                            cy="20"
                            r="18.75"
                            fill="none"
                            strokeWidth="2.5"
                            stroke={beacon.color || 'black'}
                            fill="white"
                          />

                          <text x="20" y="25" fontSize="15" textAnchor="middle" fill="black">{beacon.id}</text>

                          <path d="M 1.75 28 L 20 70 L 38.25 28 A 20 20 0 0 1 1.75 28" fill={beacon.color} />

                        </svg>

                      </g>
                    )
                }

              </Fragment>
            ))
          }
          {
            players.map(player => (
              <Fragment>
                {/* <circle r="10" cx={player.x} cy={player.y} fill={player.color}/> */}
                <g transform={`translate(${player.x - 25},${player.y - 20}) scale(0.1)`}>
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 53.545 53.545"
                  >
                    <g>
                      <g>
                        <circle fill={player.color} cx="26.686" cy="4.507" r="4.507" />
                        <path
                          fill={player.color}
                          d="M28.256,11.163c-1.123-0.228-2.344-0.218-3.447,0.042c-7.493,0.878-9.926,9.551-9.239,16.164
                        c0.298,2.859,4.805,2.889,4.504,0c-0.25-2.41-0.143-6.047,1.138-8.632c0,3.142,0,6.284,0,9.425c0,0.111,0.011,0.215,0.016,0.322
                        c-0.003,0.051-0.015,0.094-0.015,0.146c0,7.479-0.013,14.955-0.322,22.428c-0.137,3.322,5.014,3.309,5.15,0
                        c0.242-5.857,0.303-11.717,0.317-17.578c0.244,0.016,0.488,0.016,0.732,0.002c0.015,5.861,0.074,11.721,0.314,17.576
                        c0.137,3.309,5.288,3.322,5.15,0c-0.309-7.473-0.32-14.949-0.32-22.428c0-0.232-0.031-0.443-0.078-0.646
                        c-0.007-3.247-0.131-6.497-0.093-9.742c1.534,2.597,1.674,6.558,1.408,9.125c-0.302,2.887,4.206,2.858,4.504,0
                        C38.678,20.617,36.128,11.719,28.256,11.163z"
                        />
                      </g>
                    </g>

                  </svg>

                </g>
              </Fragment>
            ))
          }


          {/* {
              circumcenters.map(beacon => (
                <Fragment>
                  <circle r="2" cx={beacon.x} cy={beacon.y} fill="green"/>
                </Fragment>
              ))
            } */}
          {/* {
                movable && <circle r="2" cx={movable.x} cy={movable.y} fill="green"/>
            } */}
        </svg>
        <br />
        {/* <svg width={SVG_WIDTH} height={SVG_HEIGHT} xmlns="http://www.w3.org/2000/svg">
            {
              sounds.map(sound => (
                <Fragment>
                  <circle r="10" cx={sound.x} cy={sound.y} fill={sound.color}/>
                  <circle r={sound.soundR} cx={sound.x} cy={sound.y} fill={sound.color} opacity="0.2"/>
                </Fragment>
              ))
            }
            {
              players.map(player => <circle r="5" cx={player.x} cy={player.y} fill="blue"/>)
            }
        </svg><br/> */}
        {/* <input type="range" id="cowbell" name="cowbell" disabled={!playing}
         min="0" max="1" value={player.x/SVG_WIDTH} onChange={this.onChange} step="0.01"></input> */}
        {/* <div>
           <span>Player X</span>
           <span>{player.x}</span>
         </div> */}
        {/* <button onClick={this.onMusic} disabled={!soundsLoaded}>Play/Stop Music</button>
         <button onClick={this.onPlayerMove}>Move/Stop Players</button>
         <div>{!soundsLoaded ? 'loading sounds...' : 'sounds loaded'} </div> */}
        {/* <div>
         {
              sounds.map(sound => (
                <div>
                  <span>{sound.name}</span><br/>
                  <span>{sound.ctl && sound.ctl.gainNode.gain.value}</span>
                </div>
              ))
            }
         </div> */}
      </div>
    );
  }
}
