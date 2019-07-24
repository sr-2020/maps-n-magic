import * as R from "ramda";
import { createSource } from "./audioDataUtils";

const soundSources = {};

function startSounds(soundList) {
  soundList.forEach(startSound);
}
function startSound(soundName) {
  const ctl = createSource(soundName);
  if (!ctl.source.start) {
    ctl.source.noteOn(0);
  } else {
    ctl.source.start(0);
  }
  soundSources[soundName] = ctl;
}

function stopSounds() {
  R.values(soundSources).forEach(ctl => {
      if (!ctl.source.stop) {
        ctl.source.noteOff(0);
      } else {
        ctl.source.stop(0);
      }
  });
}

function applyVolumes(volumes) {
  volumes.forEach(volumeData => soundSources[volumeData.name].gainNode.gain.value = volumeData.gain);
}


function computeVolumesByDistance(state) {
    return [];
//   const { player, sounds } = state;

//   return sounds.map(sound => {
//     const dist = Math.sqrt((player.x - sound.x) * (player.x - sound.x) + (player.y - sound.y) * (player.y - sound.y));
//     // console.log(dist);
//     let gain;
//     if(dist < sound.soundR) {
//       gain = 1 - dist/sound.soundR;
//       gain *= gain;
//       // gain = Math.cos(gain * 0.5 * Math.PI);;
//     // } else if(dist> 10 && dist < 50) {
//     //   gain = dist/50;
//     } else {
//       gain = 0;
//     }

//     return {
//       name: sound.name,
//       gain
//     };
//   });
}

export {startSounds, stopSounds, applyVolumes, computeVolumesByDistance};