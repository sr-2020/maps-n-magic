export class SoundHolder {
  constructor(soundService) {
    this.soundService = soundService;
    this.selectedSoundName = null;
    this.onSoundStatusChange = this.onSoundStatusChange.bind(this);
    this.soundService.on('soundStatusChange', this.onSoundStatusChange);
  }

  onSoundStatusChange({ name, status }) {
    if (name === this.selectedSoundName && this.soundService.canPlaySound(name)) {
      this.soundService.playSound(name, true);
    }
  }

  playSound(soundName) {
    if (soundName) {
      this.onSelectSound(soundName);
    } else {
      this.selectedSoundName = null;
      this.soundService.stopAllSounds();
    }
  }

  onSelectSound(soundName) {
    // console.log('selectSound');
    // const { soundService } = this.props;
    const sound = this.soundService.getSound(soundName);
    const canPlay = this.soundService.canPlaySound(soundName);
    const isPlayingSound = this.soundService.isPlayingSound(soundName);
    // this.setState((state) => {
    // const { selectedSoundName } = state;
    if (this.selectedSoundName === soundName) { // play or stop some sound
    } else { // stop existing sound and play other sound
      this.soundService.playSound(this.selectedSoundName, false);
    }
    if (canPlay) {
      this.soundService.playSound(soundName, !isPlayingSound);
    } else {
      this.soundService.loadSound(soundName);
    }
    this.selectedSoundName = soundName;
    // return {
    //   selectedSoundName: soundName,
    // };
    // });
  }
}
