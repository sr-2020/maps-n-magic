import { FRACTION_SOUNDS, MANA_LEVEL_SOUNDS } from "sr2020-mm-client-event-engine";
import { AggregatedLocationView, Rotation, SoundStageState, TrackData } from "sr2020-mm-event-engine";

export function locationData2SoundStageState (locationData: AggregatedLocationView | null): SoundStageState {
  if (locationData === null) {
    return {
      backgroundSound: null,
      rotationSounds: null,
    };
  }

  return {
    backgroundSound: getBgTrackData(locationData),
    rotationSounds: getRotationSounds(locationData),
  };
}

function getRotationSounds(locationData: AggregatedLocationView): Rotation | null {
  const { spiritViews } = locationData;
  const tracks: TrackData[] = spiritViews.filter(spiritView => {
    const fractionSoundName = FRACTION_SOUNDS[spiritView.fraction];
    if (fractionSoundName === undefined) {
      console.error(`spirit ${spiritView.id} ${spiritView.name} has unknown fraction ${spiritView.fraction}`);
      return false;
    }
    return true;
  }).map(spiritView => ({
    key: spiritView.id,
    name: FRACTION_SOUNDS[spiritView.fraction],
    volumePercent: 50
  }));

  return {
    key: locationData.id,
    tracks
  };
}

function getBgTrackData(locationData: AggregatedLocationView): TrackData | null {
  const { manaLevel } = locationData;
  const soundName = MANA_LEVEL_SOUNDS[manaLevel];
  if (soundName === undefined) {
    console.error(`manaLevel out of bounds. manaLevel ${manaLevel}, locationId ${locationData.id}`);
    return null;
  } else {
    return {
      key: soundName,
      name: soundName,
      volumePercent: 50
    };
  }
}