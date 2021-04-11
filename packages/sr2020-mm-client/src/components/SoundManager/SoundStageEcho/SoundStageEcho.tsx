import React, { Component } from 'react';
import './SoundStageEcho.css';
import { GameModel, SoundStageData } from "sr2020-mm-event-engine";
import { EBackgroundSoundUpdate, ERotationSoundsUpdate } from "sr2020-mm-client-event-engine";

interface SoundStageEchoProps {
  gameModel: GameModel;
};
interface SoundStageEchoState {
  backgroundSound: string | null;
  rotationSounds: string[];
};

export class SoundStageEcho extends Component<SoundStageEchoProps, SoundStageEchoState> {

  constructor(props: SoundStageEchoProps) {
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

  componentDidUpdate = (prevProps: SoundStageEchoProps) => {
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

  onBackgroundSoundUpdate({ backgroundSound }: EBackgroundSoundUpdate) {
    this.setState({
      backgroundSound,
    });
  }

  onRotationSoundsUpdate({ rotationSounds }: ERotationSoundsUpdate) {
    this.setState({
      rotationSounds: [...rotationSounds],
    });
  }

  initialize() {
    const { gameModel } = this.props;
    const soundStage = gameModel.get<SoundStageData>('soundStage');
    this.setState({
      backgroundSound: soundStage.backgroundSound,
      rotationSounds: [...soundStage.rotationSounds],
    });
    this.subscribe(gameModel);
  }

  subscribe(gameModel: GameModel) {
    gameModel.on('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
    gameModel.on('rotationSoundsUpdate', this.onRotationSoundsUpdate);
  }

  unsubscribe(gameModel: GameModel) {
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
