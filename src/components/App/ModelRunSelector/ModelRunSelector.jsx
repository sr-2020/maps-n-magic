import React, { Component } from 'react';
import './ModelRunSelector.css';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const speeds = [0.1, 1, 10, 20];

export class ModelRunSelector extends Component {
  // static propTypes = ModelRunSelectorPropTypes;

  constructor() {
    super();
    this.state = {
      isModelRunning: false,
      speed: null,
    };

    this.onModelRunningChange = this.onModelRunningChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount = () => {
    const { gameModel } = this.props;
    this.setState({
      isModelRunning: gameModel.get('isModelRunning'),
      speed: gameModel.get('modelSpeed'),
    });
    gameModel.on('modelRunningChange', this.onModelRunningChange);
    console.log('ModelRunSelector mounted');
  }

  componentDidUpdate = () => {
    console.log('ModelRunSelector did update');
  }

  componentWillUnmount = () => {
    console.log('ModelRunSelector will unmount');
    this.props.gameModel.off('modelRunningChange', this.onModelRunningChange);
  }

  onModelRunningChange({ isModelRunning, speed }) {
    this.setState({
      isModelRunning,
      speed,
    });
  }

  onClick(type, speed) {
    return () => {
      // const { isModelRunning } = this.state;
      const { gameModel } = this.props;
      gameModel.execute({
        type,
        speed,
      });
    };
  }

  render() {
    const { isModelRunning, speed } = this.state;
    const { t } = this.props;
    return (
      <>
        <Dropdown.Item
          as="button"
          type="button"
          data-original-title=""
          onClick={this.onClick('stopModel')}
          className="ModelRunSelector tw-py-3 tw-text-lg"
        >
          <FontAwesomeIcon
            className={classNames('tw-mr-1 tw-text-base tw-w-4 tw-h-4 ', {
              invisible: isModelRunning,
            })}
            fixedWidth
            icon={faCheck}
          />
          {t('stopModelRun')}
        </Dropdown.Item>
        {
          speeds.map((speed2) => (

            <Dropdown.Item
              key={speed2}
              as="button"
              type="button"
              data-original-title=""
              onClick={this.onClick('runModel', speed2)}
              className="ModelRunSelector tw-py-3 tw-text-lg"
            >
              <FontAwesomeIcon
                className={classNames('tw-mr-1 tw-text-base tw-w-4 tw-h-4 ', {
                  invisible: !isModelRunning || speed2 !== speed,
                })}
                fixedWidth
                icon={faCheck}
              />
              {t('startModelRun', { speed: speed2 })}
            </Dropdown.Item>
          ))
        }
      </>
    );
  }
}
