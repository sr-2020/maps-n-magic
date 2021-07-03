// Web Audio API was done in prefixed webkitAudioContext and standard

import { SoundCtl } from "../../types";

// leave for compatibility
export function ctlStart(ctl: SoundCtl): void {
  if (!ctl.source.start) {
    ctl.source.noteOn(0);
  } else {
    ctl.source.start(0);
  }
}

// Web Audio API was done in prefixed webkitAudioContext and standard
// leave for compatibility
export function ctlStop(ctl: SoundCtl): void {
  if (!ctl.source.stop) {
    ctl.source.noteOff(0);
  } else {
    ctl.source.stop(0);
  }
}