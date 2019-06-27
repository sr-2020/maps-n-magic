import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import * as R from "ramda";

const SVG_WIDTH = 500;

// import Tone from "tone";

// var synth = new Tone.Synth().toMaster();
var BUFFERS = {};

var BUFFERS_TO_LOAD = {
  // kick: 'sounds/kick.wav',
  // snare: 'sounds/snare.wav',
  // hihat: 'sounds/hihat.wav',
  // jam: 'sounds/br-jam-loop.wav',
  // crowd: 'sounds/clapping-crowd.wav',
  drums: 'sounds/stargazer.mp3',
  organ: 'sounds/nightwalker.mp3',
  techno: 'sounds/BoxCat_Games_-_10_-_Epic_Song.mp3'
  // drums: 'sounds/blueyellow.wav',
  // organ: 'sounds/organ-echo-chords.wav',
  // techno: 'sounds/techno.wav'
};

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length) {
          console.log('sounds loaded');
          loader.onload(loader.bufferList);
        }
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}



// Loads all sound samples into the buffers object.
function loadBuffers(cb) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in BUFFERS_TO_LOAD) {
    var path = BUFFERS_TO_LOAD[name];
    names.push(name);
    paths.push(path);
  }
  const bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      BUFFERS[name] = buffer;
    }
    cb();
  });
  bufferLoader.load();
}

var context;
// window.addEventListener('load', init, false);
function init(cb) {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
  loadBuffers(cb);
}

function createSource(buffer) {
  var source = context.createBufferSource();
  var gainNode = context.createGain ? context.createGain() : context.createGainNode();
  source.buffer = buffer;
  // Turn on looping
  source.loop = true;
  // Connect source to gain.
  source.connect(gainNode);
  // Connect gain to destination.
  gainNode.connect(context.destination);

  return {
    source: source,
    gainNode: gainNode
  };
}

// // Fades between 0 (all source 1) and 1 (all source 2)
// // CrossfadeSample.crossfade = function(element) {
// CrossfadeSample.crossfade = function(x) {
//   // var x = parseInt(element.value) / parseInt(element.max);
//   // Use an equal-power crossfading curve:
//   var gain1 = Math.cos(x * 0.5*Math.PI);
//   var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
//   this.ctl1.gainNode.gain.value = gain1;
//   this.ctl2.gainNode.gain.value = gain2;
// };

const Timing = {};
// module.exports = Timing;

// call examples
//timing: Timing.linear,
//timing: Timing.quad,
//timing: Timing.circ,
//timing: Timing.bounce,
//timing: Timing.makeEaseOut(Timing.bounce),
//timing: Timing.makeEaseInOut(Timing.bounce),
//timing: Timing.back(3.5),
//timing: Timing.elastic(1.5),
//timing: Timing.makeEaseInOut(Timing.poly(4)),

Timing.linear = timeFraction => timeFraction;

Timing.quad = progress => (progress ** 2);

Timing.poly = R.curry((x, progress) => (progress ** x));

Timing.circ = timeFraction => 1 - Math.sin(Math.acos(timeFraction));

Timing.back = R.curry((x, timeFraction) => (timeFraction ** 2) * ((x + 1) * timeFraction - x));

Timing.bounce = (timeFraction) => {
    for (let a = 0, b = 1, result; ; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -(((11 - 6 * a - 11 * timeFraction) / 4) ** 2) + (b ** 2);
        }
    }
};

Timing.elastic = (x, timeFraction) => (2 ** (10 * (timeFraction - 1))) * Math.cos(20 * Math.PI * x / 3 * timeFraction);

Timing.makeEaseOut = timing => function (timeFraction) {
    return 1 - timing(1 - timeFraction);
};

Timing.makeEaseInOut = timing => function (timeFraction) {
    if (timeFraction < 0.5) {
        return timing(2 * timeFraction) / 2;
    }
    return (2 - timing(2 * (1 - timeFraction))) / 2;
};

const animate = (options) => {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
      // timeFraction from 0 to 1
      let timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1;

      // current animation state
      const progress = options.timing(timeFraction);

      options.draw(progress);

      if (timeFraction < 1) {
          requestAnimationFrame(animate);
      } else {
        if(options.loop) {
          start += options.duration;
          requestAnimationFrame(animate);
        }
      }
  });
};

export default class App extends Component {
  state = {
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
    init(() => {
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
      // state.movePlayer ? this.stop() : this.play();
      return {
        movePlayer: !state.movePlayer
      }
    })
  };

  play = () => {
    this.setState(state => {
      const sounds = state.sounds;
      const newSounds = sounds.map(sound => {
        const ctl = createSource(BUFFERS[sound.name]);
        if (!ctl.source.start) {
          ctl.source.noteOn(0);
        } else {
          ctl.source.start(0);
        }
        return {
          ...sound,
          ctl
        }
      });
      this.crossfade({ player: state.player, sounds : newSounds})
      return { sounds : newSounds};
    });
  }

  stop = () => {
    this.state.sounds.forEach(sound => {
        if (!sound.ctl.source.stop) {
          sound.ctl.source.noteOff(0);
        } else {
          sound.ctl.source.stop(0);
        }
    });
  }

  crossfade = (state) => {
    const { player } = state;
    state.sounds.forEach(sound => {
      const dist = Math.sqrt((player.x - sound.x) * (player.x - sound.x) + (player.y - sound.y) * (player.y - sound.y));
      // console.log(dist);
      let gain;
      if(dist < sound.soundR) {
        gain = 1 - dist/sound.soundR;
        gain *= gain;
        // gain = Math.cos(gain * 0.5 * Math.PI);;
      // } else if(dist> 10 && dist < 50) {
      //   gain = dist/50;
      } else {
        gain = 0;
      }
      sound.ctl.gainNode.gain.value = gain;
      // var gain1 = Math.cos(x * 0.5*Math.PI);
      // if (!sound.ctl.source.stop) {
      //   sound.ctl.source.noteOff(0);
      // } else {
      //   sound.ctl.source.stop(0);
      // }
  });

    // var x = parseInt(element.value) / parseInt(element.max);
    // Use an equal-power crossfading curve:
    // var gain1 = Math.cos(x * 0.5*Math.PI);
    // var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
    // this.ctl1.gainNode.gain.value = gain1;
    // this.ctl2.gainNode.gain.value = gain2;
  };

  onMusic = () => {
    // console.log('sadsdfsf');
    this.toggleMusic();
    // CrossfadeSample.crossfade(this.state.player.x/SVG_WIDTH);
    // synth.triggerAttackRelease("C4", "8n");
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
    const { sounds, player, playing, soundsLoaded } = this.state;

    return (
      <div className="App">
          <svg width={SVG_WIDTH} height="400" xmlns="http://www.w3.org/2000/svg">
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
