import React, { Component } from 'react';
import './SoundSettingsForm.css';

import classNames from 'classnames';
import { TimeoutInput } from './TimeoutInput';

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
    this.onRotationSoundTimeoutChange = this.onRotationSoundTimeoutChange.bind(this);
    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
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
  }

  onRotationSoundTimeoutUpdate({ rotationSoundTimeout }) {
    this.setState({
      rotationSoundTimeout,
    });
  }

  onRotationSoundTimeoutChange(e) {
    const { value } = e.target;
    const { gameModel } = this.props;
    gameModel.execute({
      type: 'setRotationSoundTimeout',
      rotationSoundTimeout: Number(value) * 1000,
    });
  }

  onRotationTimeoutChange(e) {
    const { value } = e.target;
    const { gameModel } = this.props;
    gameModel.execute({
      type: 'setRotationTimeout',
      rotationTimeout: Number(value) * 1000,
    });
  }

  onIncrement(prop, callback) {
    return () => {
      callback.apply(this, [{ target: { value: this.state[prop] / 1000 + 1 } }]);
    };
  }

  onDecrement(prop, callback) {
    return () => {
      callback.apply(this, [{ target: { value: this.state[prop] / 1000 - 1 } }]);
    };
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
    const { t } = this.props;
    return (
      <div className="SoundSettingsForm">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="rotationSoundTimeout"
          >
            {t('rotationSoundTimeout')}
          </label>
          <TimeoutInput
            inputId="rotationSoundTimeout"
            value={rotationSoundTimeout / 1000}
            onChange={this.onRotationSoundTimeoutChange}
            onIncrement={this.onIncrement('rotationSoundTimeout', this.onRotationSoundTimeoutChange)}
            onDecrement={this.onDecrement('rotationSoundTimeout', this.onRotationSoundTimeoutChange)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="rotationTimeout"
          >
            {t('rotationTimeout')}
          </label>
          <TimeoutInput
            inputId="rotationTimeout"
            value={rotationTimeout / 1000}
            onChange={this.onRotationTimeoutChange}
            onIncrement={this.onIncrement('rotationTimeout', this.onRotationTimeoutChange)}
            onDecrement={this.onDecrement('rotationTimeout', this.onRotationTimeoutChange)}
          />
        </div>
      </div>
    );
  }
}
