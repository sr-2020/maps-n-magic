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
      gameModel, DataProvider, DataManager, entityName, ReadStrategy, ReadStrategyArgs = [],


    } = this.props;
    this.dataManager = new DataManager(
      gameModel,
      new DataProvider(),
      entityName,
      new ReadStrategy(gameModel, ...ReadStrategyArgs),
    );
    this.dataManager.initialize();
    console.log('DataBinding mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, DataProvider, DataManager, entityName, ReadStrategy, ReadStrategyArgs = [],
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.dataManager.dispose();
      this.dataManager = new DataManager(
        gameModel,
        new DataProvider(),
        entityName,
        new ReadStrategy(gameModel, ...ReadStrategyArgs),
      );
      this.dataManager.initialize();
    }
    console.log('DataBinding did update');
  }

  componentWillUnmount() {
    this.dataManager.dispose();
    console.log('DataBinding will unmount');
  }

  render() {
    return null;
  }
}
