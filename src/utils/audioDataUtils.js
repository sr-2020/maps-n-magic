
// const BUFFERS = {};

// const BUFFERS_TO_LOAD = {
//   // kick: 'sounds/kick.wav',
//   // snare: 'sounds/snare.wav',
//   // hihat: 'sounds/hihat.wav',
//   // jam: 'sounds/br-jam-loop.wav',
//   // crowd: 'sounds/clapping-crowd.wav',
//   drums: 'sounds/stargazer.mp3',
//   organ: 'sounds/nightwalker.mp3',
//   techno: 'sounds/BoxCat_Games_-_10_-_Epic_Song.mp3'
//   // drums: 'sounds/blueyellow.wav',
//   // organ: 'sounds/organ-echo-chords.wav',
//   // techno: 'sounds/techno.wav'
// };

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
  // Load buffer asynchronously
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  const loader = this;

  request.onload = function () {
    // Asynchronously decode the audio file data in request.response
    // const responseData = request.response;
    // str2ab(ab2str(responseData));
    // const responseData2 = b642ab(ab2b64(responseData));
    const responseData = b642ab(ab2b64(request.response));
    loader.context.decodeAudioData(
      responseData,
      (buffer) => {
        if (!buffer) {
          alert(`error decoding file data: ${url}`);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount === loader.urlList.length) {
          console.log('sounds loaded');
          loader.onload(loader.bufferList);
        }
      },
      (error) => {
        console.error('decodeAudioData error', error);
      },
    );
  };

  request.onerror = function () {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function () {
  for (let i = 0; i < this.urlList.length; ++i) { this.loadBuffer(this.urlList[i], i); }
};


// // Loads all sound samples into the buffers object.
// function loadBuffers(buffersToLoad, buffers, context, cb) {
//   // Array-ify
//   const names = [];
//   const paths = [];

//   R.keys(buffersToLoad).forEach((name) => {
//     const path = buffersToLoad[name];
//     names.push(name);
//     paths.push(path);
//   });
//   const bufferLoader = new BufferLoader(context, paths, ((bufferList) => {
//     for (let i = 0; i < bufferList.length; i++) {
//       const buffer = bufferList[i];
//       const name = names[i];
//       buffers.push({
//         name,
//         buffer
//       });
//       BUFFERS[name] = buffer;
//     }
//     cb();
//   }));
//   bufferLoader.load();
// }

// let localContext;
// // window.addEventListener('load', init, false);

// function createContext() {
//   try {
//     // Fix up for prefixing
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     return new AudioContext();
//   } catch (e) {
//     throw new Error('Web Audio API is not supported in this browser');
//   }
// }

// function initSound(cb) {
//   localContext = createContext();
//   loadBuffers(BUFFERS_TO_LOAD, [], localContext, cb);
// }

// function createSource(soundName, buffer, context) {
//   if (!buffer) {
//     buffer = BUFFERS[soundName];
//   }
//   if (!context) {
//     context = localContext;
//   }
//   const source = context.createBufferSource();
//   const gainNode = context.createGain ? context.createGain() : context.createGainNode();
//   source.buffer = buffer;
//   // Turn on looping
//   source.loop = true;
//   // Connect source to gain.
//   source.connect(gainNode);
//   // Connect gain to destination.
//   gainNode.connect(context.destination);

//   return {
//     source,
//     gainNode
//   };
// }

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

// function ab2str(buf) {
//   // return String.fromCharCode.apply(null, new Uint16Array(buf));
//   return String.fromCharCode.apply(null, new Uint8Array(buf));
// }
// function str2ab(str) {
//   // const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
//   const buf = new ArrayBuffer(str.length); // 2 bytes for each char
//   // const bufView = new Uint16Array(buf);
//   const bufView = new Uint8Array(buf);
//   for (let i = 0, strLen = str.length; i < strLen; i++) {
//     bufView[i] = str.charCodeAt(i);
//   }
//   return buf;
// }

function ab2b64(buf) {
  return btoa(
    new Uint8Array(buf)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''),
  );
}

function b642ab(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// initSound, createSource, createContext, loadBuffers,
export {
  BufferLoader, ab2b64, b642ab,
};
