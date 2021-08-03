import React, { ChangeEventHandler, Component, ChangeEvent } from 'react';
import './SoundSettingsForm.css';
import * as R from 'ramda';

import classNames from 'classnames';
import { GameModel } from "sr2020-mm-event-engine";
import { WithTranslation } from "react-i18next";

import { TimeoutInput } from './TimeoutInput';
import { InputLabel } from './InputLabel';

type strToNumber = (val: string) => number;

const e2Timeout: strToNumber = R.pipe(parseInt, R.multiply(1000));
const e2Volume: strToNumber = parseInt;

// this.onRotationSoundTimeoutChange = this.onParamChange('setRotationSoundTimeout', 'rotationSoundTimeout', e2Timeout);
// this.onRotationTimeoutChange = this.onParamChange('setRotationTimeout', 'rotationTimeout', e2Timeout);
// this.onBackgroundVolumeChange = this.onParamChange('setBackgroundVolume', 'backgroundVolume', e2Volume);
// this.onRotationVolumeChange = this.onParamChange('setRotationVolume', 'rotationVolume', e2Volume);
type ActionTypes = 'setRotationSoundTimeout' | 'setRotationTimeout' | 'setBackgroundVolume' | 'setRotationVolume';
type PropNames = 'rotationSoundTimeout' | 'rotationTimeout' | 'backgroundVolume' | 'rotationVolume';

interface SoundSettingsFormProps extends WithTranslation {
  gameModel: GameModel;
}
interface SoundSettingsFormState {
  initialized: boolean;
  rotationSoundTimeout: number;
  rotationTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;
}

export class SoundSettingsForm extends Component<SoundSettingsFormProps, SoundSettingsFormState> {
  onRotationSoundTimeoutChange: ChangeEventHandler<HTMLInputElement>;
  onRotationTimeoutChange: ChangeEventHandler<HTMLInputElement>;
  onBackgroundVolumeChange: ChangeEventHandler<HTMLInputElement>;
  onRotationVolumeChange: ChangeEventHandler<HTMLInputElement>;

  constructor(props: SoundSettingsFormProps) {
    super(props);
    this.state = {
      // @ts-ignore
      rotationTimeout: null,
      // @ts-ignore
      rotationSoundTimeout: null,
      // @ts-ignore
      backgroundVolume: null,
      // @ts-ignore
      rotationVolume: null,
      initialized: false,
    };
    this.onRotationSoundTimeoutChange = this.onParamChange('setRotationSoundTimeout', 'rotationSoundTimeout', e2Timeout);
    this.onRotationTimeoutChange = this.onParamChange('setRotationTimeout', 'rotationTimeout', e2Timeout);
    this.onBackgroundVolumeChange = this.onParamChange('setBackgroundVolume', 'backgroundVolume', e2Volume);
    this.onRotationVolumeChange = this.onParamChange('setRotationVolume', 'rotationVolume', e2Volume);

    this.onParamUpdate = this.onParamUpdate.bind(this);

    this.onTimeoutIncrement = this.onTimeoutIncrement.bind(this);
    this.onTimeoutDecrement = this.onTimeoutDecrement.bind(this);
    this.onVolumeIncrement = this.onVolumeIncrement.bind(this);
    this.onVolumeDecrement = this.onVolumeDecrement.bind(this);
  }

  componentDidMount = () => {
    this.onSoundStageUpdate();
    this.subscribe(this.props.gameModel);
    this.setState({
      initialized: true,
    });
    console.log('SoundSettingsForm mounted');
  }

  componentDidUpdate = (prevProps: SoundSettingsFormProps) => {
    if (prevProps.gameModel !== this.props.gameModel) {
      this.onGameModelUpdate(prevProps);
    }
    console.log('SoundSettingsForm did update');
  }

  componentWillUnmount = () => {
    this.unsubscribe(this.props.gameModel);
    console.log('SoundSettingsForm will unmount');
  }

  onGameModelUpdate(prevProps: SoundSettingsFormProps) {
    const { gameModel } = this.props;
    this.unsubscribe(prevProps.gameModel);
    // this.onSoundUpdate();
    this.onSoundStageUpdate();
    this.subscribe(gameModel);
  }

  onSoundStageUpdate() {
    const { gameModel } = this.props;
    const soundStageState = gameModel.get('soundStage');
    this.setState({
      ...R.pick(['rotationTimeout', 'rotationSoundTimeout', 'backgroundVolume', 'rotationVolume'], soundStageState),
    });
  }

  onParamUpdate(data: SoundSettingsFormState) {
    this.setState({
      ...data,
    });
  }

  onParamChange(type: ActionTypes, prop: PropNames, e2value: strToNumber) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const { gameModel } = this.props;
      gameModel.execute({
        type,
        [prop]: e2value(value),
      });
    };
  }

  onTimeoutIncrement(
    prop: 'rotationSoundTimeout' | 'rotationTimeout', 
    callback: ChangeEventHandler<HTMLInputElement>
  ) {
    return () => {
      // eslint-disable-next-line react/destructuring-assignment
      // @ts-ignore
      callback.apply(this, [{ target: { value: this.state[prop] / 1000 + 1 } }]);
    };
  }

  onTimeoutDecrement(
    prop: 'rotationSoundTimeout' | 'rotationTimeout', 
    callback: ChangeEventHandler<HTMLInputElement>
  ) {
    return () => {
      // eslint-disable-next-line react/destructuring-assignment
      // @ts-ignore
      callback.apply(this, [{ target: { value: this.state[prop] / 1000 - 1 } }]);
    };
  }

  onVolumeIncrement(
    prop: 'rotationVolume' | 'backgroundVolume', 
    callback: ChangeEventHandler<HTMLInputElement>
  ) {
    return () => {
      // eslint-disable-next-line react/destructuring-assignment
      // @ts-ignore
      callback.apply(this, [{ target: { value: this.state[prop] + 10 } }]);
    };
  }

  onVolumeDecrement(
    prop: 'rotationVolume' | 'backgroundVolume', 
    callback: ChangeEventHandler<HTMLInputElement>
  ) {
    return () => {
      // eslint-disable-next-line react/destructuring-assignment
      // @ts-ignore
      callback.apply(this, [{ target: { value: this.state[prop] - 10 } }]);
    };
  }

  subscribe(gameModel: GameModel) {
    gameModel.on('rotationTimeoutUpdate', this.onParamUpdate);
    gameModel.on('rotationSoundTimeoutUpdate', this.onParamUpdate);
    gameModel.on('backgroundVolumeUpdate', this.onParamUpdate);
    gameModel.on('rotationVolumeUpdate', this.onParamUpdate);
  }

  unsubscribe(gameModel: GameModel) {
    gameModel.off('rotationTimeoutUpdate', this.onParamUpdate);
    gameModel.off('rotationSoundTimeoutUpdate', this.onParamUpdate);
    gameModel.off('backgroundVolumeUpdate', this.onParamUpdate);
    gameModel.off('rotationVolumeUpdate', this.onParamUpdate);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      initialized, rotationSoundTimeout, rotationTimeout, backgroundVolume, rotationVolume,
    } = this.state;

    if (!initialized) {
      return null;
    }
    const { t } = this.props;
    return (
      <div className="SoundSettingsForm">
        <div className="tw-mb-4">
          <InputLabel translationKey="rotationSoundTimeout" htmlFor="rotationSoundTimeout" />
          <TimeoutInput
            inputId="rotationSoundTimeout"
            value={rotationSoundTimeout / 1000}
            onChange={this.onRotationSoundTimeoutChange}
            onIncrement={this.onTimeoutIncrement('rotationSoundTimeout', this.onRotationSoundTimeoutChange)}
            onDecrement={this.onTimeoutDecrement('rotationSoundTimeout', this.onRotationSoundTimeoutChange)}
            incrementKey="incrementSoundTimeout"
            decrementKey="decrementSoundTimeout"
          />
        </div>
        <div className="tw-mb-4">
          <InputLabel translationKey="rotationTimeout" htmlFor="rotationTimeout" />
          <TimeoutInput
            inputId="rotationTimeout"
            value={rotationTimeout / 1000}
            onChange={this.onRotationTimeoutChange}
            onIncrement={this.onTimeoutIncrement('rotationTimeout', this.onRotationTimeoutChange)}
            onDecrement={this.onTimeoutDecrement('rotationTimeout', this.onRotationTimeoutChange)}
            incrementKey="incrementSoundTimeout"
            decrementKey="decrementSoundTimeout"
          />
        </div>
        <div className="tw-mb-4">
          <InputLabel translationKey="backgroundVolume" htmlFor="backgroundVolume" />
          <TimeoutInput
            inputId="backgroundVolume"
            value={backgroundVolume}
            onChange={this.onBackgroundVolumeChange}
            onIncrement={this.onVolumeIncrement('backgroundVolume', this.onBackgroundVolumeChange)}
            onDecrement={this.onVolumeDecrement('backgroundVolume', this.onBackgroundVolumeChange)}
            incrementKey="incrementVolume"
            decrementKey="decrementVolume"
          />
        </div>
        <div className="tw-mb-4">
          <InputLabel translationKey="rotationVolume" htmlFor="rotationVolume" />
          <TimeoutInput
            inputId="rotationVolume"
            value={rotationVolume}
            onChange={this.onRotationVolumeChange}
            onIncrement={this.onVolumeIncrement('rotationVolume', this.onRotationVolumeChange)}
            onDecrement={this.onVolumeDecrement('rotationVolume', this.onRotationVolumeChange)}
            incrementKey="incrementVolume"
            decrementKey="decrementVolume"
          />
        </div>
      </div>
    );
  }
}
