// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import './DataBinding.css';

// import { DataBindingPropTypes } from '../../types';

export class DataBinding extends Component {
  // static propTypes = DataBindingPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      gameModel, DataProvider, DataManager, entityName,
    } = this.props;
    this.innerCommunicator = new DataManager();
    this.innerCommunicator.initialize(gameModel, DataProvider, entityName);
    console.log('DataBinding mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, DataProvider, DataManager, entityName,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.innerCommunicator.dispose();
      this.innerCommunicator = new DataManager();
      this.innerCommunicator.initialize(gameModel, DataProvider, entityName);
    }
    console.log('DataBinding did update');
  }

  componentWillUnmount() {
    this.innerCommunicator.dispose();
    console.log('DataBinding will unmount');
  }

  render() {
    return null;
  }
}
