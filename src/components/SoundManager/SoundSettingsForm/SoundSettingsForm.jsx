import React, { Component } from 'react';
import './SoundSettingsForm.css';

// import { SoundSettingsFormPropTypes } from '../../types';

export class SoundSettingsForm extends Component {
  // static propTypes = SoundSettingsFormPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      rotationTimeout: null,
      rotationSoundTimeout: null,
      initialized: false,
    };
    this.onRotationTimeoutUpdate = this.onRotationTimeoutUpdate.bind(this);
    this.onRotationSoundTimeoutUpdate = this.onRotationSoundTimeoutUpdate.bind(this);
  }

  componentDidMount = () => {
    this.onSoundStageUpdate();
    this.subscribe(this.props.gameModel);
    this.setState({
      initialized: true,
    });
    console.log('SoundSettingsForm mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.gameModel !== this.props.gameModel) {
      this.onGameModelUpdate(prevProps);
    }
    console.log('SoundSettingsForm did update');
  }

  componentWillUnmount = () => {
    this.unsubscribe(this.props.gameModel);
    console.log('SoundSettingsForm will unmount');
  }

  onGameModelUpdate(prevProps) {
    this.unsubscribe(prevProps.gameModel);
    // this.onSoundUpdate();
    this.onSoundStageUpdate();
    this.subscribe(this.props.gameModel);
  }

  onSoundStageUpdate() {
    const { gameModel } = this.props;
    const soundStageState = gameModel.get('soundStage');
    this.setState({
      rotationTimeout: soundStageState.rotationTimeout,
      rotationSoundTimeout: soundStageState.rotationSoundTimeout,
    });
  }

  onRotationTimeoutUpdate({ rotationTimeout }) {
    this.setState({
      rotationTimeout,
    });
    // this.rotationTimeout = rotationTimeout;
  }

  onRotationSoundTimeoutUpdate({ rotationSoundTimeout }) {
    this.setState({
      rotationSoundTimeout,
    });
    // this.rotationSoundTimeout = rotationSoundTimeout;
  }

  subscribe(gameModel) {
    gameModel.on('rotationTimeoutUpdate', this.onRotationTimeoutUpdate);
    gameModel.on('rotationSoundTimeoutUpdate', this.onRotationSoundTimeoutUpdate);
  }

  unsubscribe(gameModel) {
    gameModel.off('rotationTimeoutUpdate', this.onRotationTimeoutUpdate);
    gameModel.off('rotationSoundTimeoutUpdate', this.onRotationSoundTimeoutUpdate);
  }

  render() {
    const { initialized, rotationSoundTimeout, rotationTimeout } = this.state;

    if (!initialized) {
      return null;
    }
    // const { t } = this.props;

    // if (!something) {
    //   return <div> SoundSettingsForm stub </div>;
    //   // return null;
    // }
    return (
      <div className="SoundSettingsForm">
        SoundSettingsForm body
        {rotationSoundTimeout}
        <br />
        {rotationTimeout}
        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="locationName"
          >
            {t('locationName')}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="locationName"
            type="text"
            value={name}
            onChange={onChange('name')}
            onKeyPress={this._handleKeyDown}
          />
        </div> */}
      </div>
    );
  }
}
