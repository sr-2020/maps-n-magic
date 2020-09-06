import React, { Component } from 'react';
import './ModelRunControl.css';

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

// import { ModelRunControlPropTypes } from '../../types';

export class ModelRunControl extends Component {
  // static propTypes = ModelRunControlPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      isModelRunning: false,
    };

    this.onModelRunningChange = this.onModelRunningChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount = () => {
    const { gameModel } = this.props;
    this.setState({
      isModelRunning: gameModel.get('isModelRunning'),
    });
    gameModel.on('modelRunningChange', this.onModelRunningChange);
    console.log('ModelRunControl mounted');
  }

  componentDidUpdate = () => {
    console.log('ModelRunControl did update');
  }

  componentWillUnmount = () => {
    console.log('ModelRunControl will unmount');
    this.props.gameModel.off('modelRunningChange', this.onModelRunningChange);
  }

  onModelRunningChange({ isModelRunning }) {
    this.setState({
      isModelRunning,
    });
  }

  onClick() {
    const { isModelRunning } = this.state;
    const { gameModel } = this.props;
    gameModel.execute(isModelRunning ? 'stopModel' : {
      type: 'runModel',
      speed: 1,
    });
  }

  // gameModel.start();


  render() {
    const { isModelRunning } = this.state;
    const { t } = this.props;

    // if (!something) {
    //   return <div> ModelRunControl stub </div>;
    //   // return null;
    // }
    return (
      <Button
        variant="outline-secondary"
        className="ModelRunControl"
        onClick={this.onClick}
      >
        {!isModelRunning ? t('startModelRun') : t('stopModelRun')}
      </Button>
    );
  }
}
