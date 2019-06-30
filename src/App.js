import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as R from "ramda";
import  {Delaunay} from "d3-delaunay";

import beacons from './beacons.json';

import { animate, Timing } from "./animation";
import { createSource, initSound } from "./audioUtils";
import { startSounds, stopSounds, applyVolumes, computeVolumesByDistance } from "./audio";

const SVG_WIDTH = 500;
const SVG_HEIGHT = 400;

const imageCenter = {
  x: SVG_WIDTH/2,
  y: SVG_HEIGHT/2,
};

const beaconCenter = beacons.reduce( (acc, beacon) => {
  acc.x += beacon.x;
  acc.y += beacon.y;
  return acc;
}, {x:0, y:0});

beaconCenter.x /= beacons.length;
beaconCenter.y /= beacons.length;

const correctedBeacons = beacons.map(beacon => ({
  x: beacon.x + imageCenter.x-beaconCenter.x,
  y: beacon.y + imageCenter.y-beaconCenter.y
}));

const points = correctedBeacons.map(beacon => [beacon.x, beacon.y]);
const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([0, 0, SVG_WIDTH, SVG_HEIGHT]);

const polygons = [];
for(let polygon of voronoi.cellPolygons()) {
  polygons.push(polygon);
  // console.log(polygon);
}
// const circumcenters = voronoi.circumcenters.reduce((acc, el, i) => {
//   if(i%2 === 0) {
//     acc[i/2] = {x: el};
//   } else {
//     acc[(i-1)/2].y = el;
//   }
//   return acc;
// }, []);
// console.log(circumcenters);

export default class App extends Component {
  state = {
    beacons:correctedBeacons,
    sounds : [
      {
       x: 50,
       y: 100,
       soundR: 200,
       color: "crimson",
       name: 'drums'
     },
      {
       x: 250,
       y: 300,
       soundR: 150,
       color: "grey",
       name: 'techno'
     },
     {
       x: 450,
       y: 100,
       soundR: 250,
       color: "green",
       name: 'organ'
    }],
    player: {
      x: 250,
      y: 100
    },
    playing: false,
    movePlayer: true,
    soundsLoaded: false
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
        that.setState(state => {
          if(!state.movePlayer) {
            return null;
          }
          const newState = { 
            player: {
              x: 200 + Math.cos(progress*2 * Math.PI) * 100,
              y: 150 + Math.sin(progress*2 * Math.PI) * 100
            }, 
            sounds : [...state.sounds]
          };
          if(state.playing) {
            that.crossfade(newState);
          }
          return newState;
        }
        )
      },
      loop: true
    });
  }

  toggleMusic = () => {
    this.setState(state => {
      state.playing ? this.stop() : this.play();
      return {
        playing: !state.playing
      }
    })
  };

  togglePlayerMove = () => {
    this.setState(state => {
      return {
        movePlayer: !state.movePlayer
      }
    })
  };

  play = () => {
    startSounds(this.state.sounds.map(R.prop('name')));
    this.crossfade(this.state);
  }

  stop = () => {
    stopSounds();
  }

  crossfade = (state) => {
    const volumes = computeVolumesByDistance(state);
    applyVolumes(volumes);
  };

  onMusic = () => {
    this.toggleMusic();
  }

  onPlayerMove = (event) => {
    this.togglePlayerMove();
  }
  onChange = (event) => {
    const {value} = event.target;
    // const event2 = event;
    this.setState(state => {
      this.crossfade(state);
      return {
        player: {...state.player, x: value*SVG_WIDTH}, 
        sounds: state.sounds
      };
    });
    // console.log(event.target.value);
  }


  
  render() {
    const { sounds, player, playing, soundsLoaded, beacons } = this.state;

    return (
      <div className="App">
          <svg class="root-image" width={SVG_WIDTH} height={SVG_HEIGHT} xmlns="http://www.w3.org/2000/svg">
            {
              polygons.map(polygon => (
                <Fragment>
                  <polyline fill="none" stroke="red" stroke-width="2" points={polygon.map(pt => pt.join(',')).join(' ')}/>
                  {/* <circle r="2" cx={polygon.map()x} cy={beacon.y} fill="green"/> */}
                  {/* <circle r={sound.soundR} cx={sound.x} cy={sound.y} fill={sound.color} opacity="0.2"/> */}
                </Fragment>
              ))
            }
            {
              beacons.map(beacon => (
                <Fragment>
                  <circle r="2" cx={beacon.x} cy={beacon.y} fill="grey"/>
                  <g transform={`translate(${beacon.x-40/4},${beacon.y-70/2}) scale(0.5)`}>
                    <svg version="1.1"
                      baseProfile="full"
                      width="40" height="70"
                      viewBox="0 0 40 70"
                      xmlns="http://www.w3.org/2000/svg">

                    <circle cx="20" cy="20" r="18.75" fill="none" stroke-width="2.5" stroke="black" fill="white"/>
                    
                    <text x="20" y="25" font-size="15" text-anchor="middle" fill="black">SVG</text>

                    <path d="M 1.75 28 L 20 70 L 38.25 28 A 20 20 0 0 1 1.75 28"  />
                    
                  </svg>

                  </g>

                  {/* <circle r={sound.soundR} cx={sound.x} cy={sound.y} fill={sound.color} opacity="0.2"/> */}
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
            
          {/* <circle r="10" cx={player.x} cy={player.y} fill="blue"/> */}
        </svg><br/>
          <svg width={SVG_WIDTH} height={SVG_HEIGHT} xmlns="http://www.w3.org/2000/svg">
            {
              sounds.map(sound => (
                <Fragment>
                  <circle r="10" cx={sound.x} cy={sound.y} fill={sound.color}/>
                  <circle r={sound.soundR} cx={sound.x} cy={sound.y} fill={sound.color} opacity="0.2"/>
                </Fragment>
              ))
            }
          <circle r="10" cx={player.x} cy={player.y} fill="blue"/>
        </svg><br/>
        {/* <input type="range" id="cowbell" name="cowbell" disabled={!playing}
         min="0" max="1" value={player.x/SVG_WIDTH} onChange={this.onChange} step="0.01"></input> */}
         {/* <div>
           <span>Player X</span>
           <span>{player.x}</span>
         </div> */}
         <button onClick={this.onMusic} disabled={!soundsLoaded}>Play/Stop Music</button>
         <button onClick={this.onPlayerMove}>Move/Stop Player</button>
         <div>{!soundsLoaded ? 'loading sounds...' : 'sounds loaded'} </div>
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
