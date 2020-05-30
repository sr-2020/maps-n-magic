// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import './EntityCommunicator.css';
import { ManageableEntity } from './ManageableEntity';

// import { EntityCommunicatorPropTypes } from '../../types';

export class EntityCommunicator extends Component {
  // static propTypes = EntityCommunicatorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      gameModel, DataProvider, entityName,
    } = this.props;
    this.innerCommunicator = new ManageableEntity();
    this.innerCommunicator.initialize(gameModel, DataProvider, entityName);
    console.log('EntityCommunicator mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, DataProvider, entityName,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.innerCommunicator.dispose();
      this.innerCommunicator = new ManageableEntity();
      this.innerCommunicator.initialize(gameModel, DataProvider, entityName);
    }
    console.log('EntityCommunicator did update');
  }

  componentWillUnmount() {
    this.innerCommunicator.dispose();
    console.log('EntityCommunicator will unmount');
  }

  render() {
    return null;
  }
}
