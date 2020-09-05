import React, { Component } from 'react';
import './SoundStageEcho.css';

// import { SoundStageEchoPropTypes } from '../../../types';

export class SoundStageEcho extends Component {
  // static propTypes = SoundStageEchoPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      backgroundSound: null,
      rotationSounds: [],
    };
    this.onBackgroundSoundUpdate = this.onBackgroundSoundUpdate.bind(this);
    this.onRotationSoundsUpdate = this.onRotationSoundsUpdate.bind(this);
  }

  componentDidMount = () => {
    this.initialize();
    console.log('SoundStageEcho mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.gameModel !== this.props.gameModel) {
      this.unsubscribe(prevProps.gameModel);
      this.initialize();
    }
    console.log('SoundStageEcho did update');
  }

  componentWillUnmount = () => {
    const { gameModel } = this.props;
    this.unsubscribe(gameModel);
    console.log('SoundStageEcho will unmount');
  }

  onBackgroundSoundUpdate({ backgroundSound }) {
    this.setState({
      backgroundSound,
    });
  }

  onRotationSoundsUpdate({ rotationSounds }) {
    this.setState({
      rotationSounds: [...rotationSounds],
    });
  }

  initialize() {
    const { gameModel } = this.props;
    const soundStage = gameModel.get('soundStage');
    this.setState({
      backgroundSound: soundStage.backgroundSound,
      rotationSounds: [...soundStage.rotationSounds],
    });
    this.subscribe(gameModel);
  }

  subscribe(gameModel) {
    gameModel.on('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
    gameModel.on('rotationSoundsUpdate', this.onRotationSoundsUpdate);
  }

  unsubscribe(gameModel) {
    gameModel.off('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
    gameModel.off('rotationSoundsUpdate', this.onRotationSoundsUpdate);
  }


  render() {
    const { backgroundSound, rotationSounds } = this.state;

    return (
      <div className="SoundStageEcho">
        {/* SoundStageEcho body */}
        <div>
          <div>background sound</div>
          <div>{backgroundSound}</div>
        </div>
        <div>
          <div>rotation sounds</div>
          <ul>
            {
              rotationSounds.map((sound) => <li key={sound}>{sound}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }
}
