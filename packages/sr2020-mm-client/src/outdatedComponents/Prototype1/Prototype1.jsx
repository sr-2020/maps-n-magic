/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
// import logo from './logo.svg';
import './Prototype1.css';
import * as R from 'ramda';

// import beacons from '../../data/beacons.json';
import initialPlayers from '../../data/players.json';

import { animate, Timing } from '../../utils/animation';

import { getPolygons } from '../../utils/polygonGenerator';

import { MapMarker } from '../MapMarker';
import { MapPoint } from '../MapPoint';

import { Prototype1PropTypes } from '../../types';

// const SVG_WIDTH = 500;
// const SVG_HEIGHT = 400;

// const imageCenter = {
//   x: SVG_WIDTH / 2,
//   y: SVG_HEIGHT / 2,
// };

// const beaconCenter = beacons.reduce((acc, beacon) => {
//   acc.x += beacon.x;
//   acc.y += beacon.y;
//   return acc;
// }, { x: 0, y: 0 });

// beaconCenter.x /= beacons.length;
// beaconCenter.y /= beacons.length;

// const correctedBeacons = beacons.map((beacon, i) => ({
//   ...beacon,
//   x: beacon.x + imageCenter.x - beaconCenter.x,
//   y: beacon.y + imageCenter.y - beaconCenter.y,
//   color: ['red', 'green', 'blue'][i % 4]
// }));

// const sortBeacons = R.pipe(R.sortBy(R.prop('x')), R.sortBy(R.prop('y')));

export class Prototype1 extends Component {
  static propTypes = Prototype1PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      polygonData: {},
      sounds: [
      ],
      players: initialPlayers,
      playing: false,
      playGhostSound: true,
      playAreaSound: true,
      movePlayers: true,
      soundsLoaded: false,
      movableId: null,
      showBeaconMarkers: false,
      listenPlayer: initialPlayers[0].id,
    };
  }

  componentDidMount() {
    const {
      beacons, svgWidth, svgHeight, audioService,
    } = this.props;
    // this.setState(({ beacons }) => ({
    this.setState(({
      polygonData: getPolygons(beacons, svgWidth, svgHeight),
    }));
    audioService.isLoaded.then(() => this.setState({
      soundsLoaded: true,
    }));
    this.animatePlayer();
  }

  animatePlayer = () => {
    const that = this;
    this.animation = animate({
      duration: 20000,
      timing: Timing.makeEaseInOut(Timing.linear),
      draw(progress) {
        that.setState((state) => {
          if (!state.movePlayers) {
            return null;
          }
          const newState = {
            ...state,
            players: state.players.map((player) => ({
              ...player,
              x: player.startX + Math.cos(progress * player.speed * 2 * Math.PI) * player.rx,
              y: player.startY + Math.sin(progress * player.speed * 2 * Math.PI) * player.ry * player.moveDirection,
            })),
            // players: [{
            //   x: 200 + Math.cos(progress*2 * Math.PI) * 100,
            //   y: 150 + Math.sin(progress*2 * Math.PI) * 100
            // }],
            sounds: [...state.sounds],
          };
          if (state.playing) {
            that.crossfade(newState);
          }
          return newState;
        });
      },
      loop: true,
    });
  }

  toggleMusic = () => {
    this.setState((state) => {
      // eslint-disable-next-line no-unused-expressions
      state.playing ? this.stop() : this.play();
      return {
        playing: !state.playing,
      };
    });
  };

  togglePlayerMove = () => {
    this.setState((state) => ({
      movePlayers: !state.movePlayers,
    }));
  };

  play = () => {
    const { sounds } = this.state;
    const { audioService } = this.props;
    audioService.startSounds(sounds.map(R.prop('name')));
    this.crossfade(this.state);
  }

  componentWillUnmount = () => {
    const { audioService } = this.props;
    audioService.stopSounds();
    this.animation.enable = false;
  }

  stop = () => {
    const { audioService } = this.props;
    audioService.stopSounds();
  }

  // getBeaconColor = (index) => {
  //   switch (index % 4) {
  //   case 0:
  //     return 'blue';
  //   case 1:
  //     return 'red';
  //   case 2:
  //     return 'green';
  //   default:
  //     return 'none';
  //   }
  // }

  crossfade = (state) => {
    const {
      playAreaSound, playGhostSound, players, polygonData, listenPlayer,
    } = state;
    const player = players.find((player2) => player2.id === listenPlayer);

    const arrId = polygonData.delaunay.find(player.x, player.y);
    const id = polygonData.beaconIds[arrId];

    const ghost = players.find((player2) => player2.id === 'Ghost');
    // if (polygonData && polygonData.delaunay) {
    const ghostIndex = polygonData.delaunay.find(ghost.x, ghost.y);
    const ghostIsHere = arrId === ghostIndex;
    // const ghostPolygonId = state.polygonData.beaconIds[ghostIndex];
    // console.log(id);

    const { beacons } = this.props;
    // const beacon = state.beacons.find(beacon => beacon.id === id);
    const beaconIndex = beacons.findIndex((beacon) => beacon.id === id);
    const beacon = beacons[beaconIndex];
    // console.log(beacon);

    // const { color } = beacon;
    // const color = this.getBeaconColor(beaconIndex);

    const { sound: curBeaconSound } = beacon.props;
    // const volumes = state.sounds.map((sound) => {
    //   if ((sound.name === 'drums' && color === 'blue')
    //   || (sound.name === 'techno' && color === 'red')
    //   || (sound.name === 'organ' && color === 'green')
    //   ) {
    //     return {
    //       name: sound.name,
    //       gain: 1
    //     };
    //   }
    //   return {
    //     name: sound.name,
    //     gain: 0
    //   };
    // });

    // const volumes = computeVolumesByDistance(state);
    // applyVolumes(volumes);
    const { audioService } = this.props;
    let volumes = audioService.getSoundNames().map((soundName) => ({
      name: soundName,
      // gain: (soundName === curBeaconSound || (ghostIsHere && soundName === 'ghost')) ? 1 : 0
      gain: playAreaSound && (soundName === curBeaconSound) ? 1 : 0,
    }));
    if (playGhostSound && ghostIsHere) {
      volumes = volumes.map((sound) => ({
        ...sound,
        gain: (sound.name === 'ghost') ? 1 : sound.gain,
      }));
    }

    audioService.applyVolumes(volumes);
  };

  onMusic = () => {
    this.toggleMusic();
  }

  onPlayerMove = () => {
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

  // listenStub = (type) => (event) => console.log(type, event);

  toggleBeaconMarker = () => {
    this.setState((state) => ({
      showBeaconMarkers: !state.showBeaconMarkers,
    }));
  }

  setMovable = () => () => {
    // event.stopPropagation();
    // // console.log('setMovable', id);
    // this.setState(state =>
    //   // console.log(state.movableId == null, (state.movableId == null ? null : id));
    //   ({
    //     movableId: (state.movableId == null ? id : null)
    //   }));
  };

  // clearMovable = (id) => (event) => {
  //   console.log('clearMovable', id);
  //   this.setState({
  //     movableId: null
  //   })
  // };
  moveMovable = () => {
    // const rect = document.querySelector('svg.root-image').getBoundingClientRect();
    // // const rect = event.target.getBoundingClientRect();
    // // console.log(event.location);
    // const eX = event.clientX;
    // const eY = event.clientY;
    // const movable = {
    //   x: eX - rect.left,
    //   y: eY - rect.top
    // };
    // this.setState((state) => {
    //   if (state.movableId == null) return null;

    //   // console.log(state.movableId);
    //   const beacons = state.beacons.map((beacon) => {
    //     if (beacon.id !== state.movableId) return beacon;
    //     return {
    //       ...beacon,
    //       ...movable
    //     };
    //   });

    //   return {
    //     movable,
    //     beacons,
    //     polygonData: getPolygons(beacons, SVG_WIDTH, SVG_HEIGHT)
    //   };
    // });
  }

  onStateChange = (prop) => (e) => {
    this.setState({
      [prop]: e.target.value,
    });
  }

  onCheckboxChange = (prop) => (e) => {
    this.setState({
      [prop]: e.target.checked,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      players, playing, soundsLoaded, polygonData, showBeaconMarkers, movePlayers, listenPlayer,
      playGhostSound, playAreaSound,
    } = this.state;
    const {
      beacons, svgWidth, svgHeight, audioService,
    } = this.props;

    let ghostPolygonId;
    const ghostPlayer = players.find((player2) => player2.id === 'Ghost');
    if (polygonData && polygonData.delaunay) {
      const arrId = polygonData.delaunay.find(ghostPlayer.x, ghostPlayer.y);
      ghostPolygonId = polygonData.beaconIds[arrId];
    }

    return (
      <div className="Prototype1  flex-row justify-content-center">

        <svg
          className="root-image margin-2rem"
          width={svgWidth}
          height={svgHeight}
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={this.moveMovable}
          onClick={this.setMovable(null)}
        >
          <defs>

            <pattern
              id="diagonal1"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <g fill="#85D2FF" fillOpacity="0.7">
                <rect x="0" y="0" width="10" height="10" />
                <rect x="0" y="10" width="10" height="10" />
              </g>
            </pattern>
            <mask id="diagonalMask1" x="0" y="0" width="1" height="1">
              <rect x="0" y="0" width="1000" height="1000" fill="url(#diagonal1)" />
            </mask>
            <pattern
              id="diagonal2"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-45)"
            >

              <g fill="#8500FF" fillOpacity="0.7">
                <rect x="10" y="0" width="10" height="10" />
                <rect x="10" y="10" width="10" height="10" />
              </g>
            </pattern>

            <mask id="diagonalMask2" x="0" y="0" width="1" height="1">
              <rect x="0" y="0" width="1000" height="1000" fill="url(#diagonal2)" />
            </mask>
          </defs>
          {/* onMouseMove={this.listenStub('onMouseMove')} */}
          {
            polygonData.polygons && polygonData.polygons.map((polygon, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <g key={i}>
                {/* <polyline fill={polygonData.beaconColors[i] || 'none'} stroke="grey" strokeWidth="2" opacity="0.5" points={polygon.map(pt => pt.join(',')).join(' ')} /> */}
                <polyline
                  fill={audioService.getSoundProps(beacons[i].props.sound).color || 'none'}
                  mask="url(#diagonalMask1)"
                  stroke="grey"
                  strokeWidth="2"
                  opacity="0.5"
                  points={polygon.map((pt) => pt.join(',')).join(' ')}
                />

                {(beacons[i].id === ghostPolygonId) && (
                  <polyline
                    fill="black"
                    mask="url(#diagonalMask2)"
                    stroke="grey"
                    strokeWidth="2"

                    points={polygon.map((pt) => pt.join(',')).join(' ')}
                  />
                )}

                <polyline
                  fill="none"
                  stroke="grey"
                  strokeWidth="2"
                  opacity="0.5"
                  points={polygon.map((pt) => pt.join(',')).join(' ')}
                />
                {/* <circle r="2" cx={polygon.map()x} cy={beacon.y} fill="green"/> */}
                {/* <circle r={sound.soundR} cx={sound.x} cy={sound.y} fill={sound.color} opacity="0.2"/> */}
              </g>
            ))
          }
          {
            polygonData.polygonCenters && polygonData.polygonCenters.map((center, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <g key={i}>
                {/* <circle r="2" cx={center.x} cy={center.y} fill="black"/> */}
                <text x={center.x} y={center.y + 5} fontSize="15" textAnchor="middle" fill="black">{center.id}</text>
              </g>
            ))
          }
          {
            beacons.map((beacon) => (
              <g key={beacon.id}>
                <MapPoint x={beacon.x} y={beacon.y} fill="grey" />

                {
                  showBeaconMarkers
                    && (

                      <MapMarker
                        x={beacon.x}
                        y={beacon.y}
                        id={beacon.id}
                        color={beacon.color}
                        onClick={this.setMovable(beacon.id)}
                      />
                    )
                }

              </g>
            ))
          }
          {
            players.map((player, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <g key={i}>
                <ellipse
                  cx={player.startX}
                  cy={player.startY}
                  rx={player.rx}
                  ry={player.ry}
                  fill="none"
                  stroke="grey"
                  strokeWidth="2"
                  opacity="0.5"
                  strokeDasharray="15"
                />
                <circle r="5" cx={player.x} cy={player.y} fill={player.color} />
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
              </g>
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
        <div className="margin-2rem">
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
          <input id="enableGhostSoundInput" type="checkbox" onChange={this.onCheckboxChange('playGhostSound')} checked={playGhostSound} disabled={!soundsLoaded} />
          <label htmlFor="enableGhostSoundInput">Enable ghost sound</label>
          <br />
          <input id="enableAreaSoundInput" type="checkbox" onChange={this.onCheckboxChange('playAreaSound')} checked={playAreaSound} disabled={!soundsLoaded} />
          <label htmlFor="enableAreaSoundInput">Enable area sound</label>
          <br />
          <label>Listen player</label>
          <select
            onChange={this.onStateChange('listenPlayer')}
            value={listenPlayer}
          >
            {/* <option value="">No value</option> */}
            {players.map((el) => <option key={el.id} value={el.id}>{`${el.id}(${el.color})`}</option>)}
          </select>
          <div>
            {!soundsLoaded ? 'loading sounds...' : 'sounds loaded'}
          </div>
          <br />
        </div>
      </div>
    );
  }
}
