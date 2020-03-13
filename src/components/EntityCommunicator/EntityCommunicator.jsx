// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import './EntityCommunicator.css';

// import { EntityCommunicatorPropTypes } from '../../types';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class EntityCommunicator extends Component {
  entities = [];
  // static propTypes = EntityCommunicatorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onPostEntityRequested = this.onPostEntityRequested.bind(this);
    this.onPutEntityRequested = this.onPutEntityRequested.bind(this);
    this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, EntityHolder, entityName,
    } = this.props;
    this.entityName = entityName;
    this.plural = `${entityName}s`;
    this.ccEntityName = capitalizeFirstLetter(entityName);
    this.holder = new EntityHolder();
    this.subscribe('on', gameModel);
    this.loadEntities();
    console.log('EntityCommunicator mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.loadEntities();
    }
    console.log('EntityCommunicator did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('EntityCommunicator will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action](`post${this.ccEntityName}Requested`, this.onPostEntityRequested);
    gameModel[action](`put${this.ccEntityName}Requested`, this.onPutEntityRequested);
    gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  onPutEntityRequested({ id, props }) {
    clearTimeout(this.inputChangeTimeout);

    this.inputChangeTimeout = setTimeout(() => {
      this.holder.put({ id, props }).then((entity) => {
        const index = this.entities.findIndex((br) => br.id === id);
        this.entities[index] = entity;
        const {
          gameModel,
        } = this.props;
        gameModel.execute({
          type: `put${this.ccEntityName}Confirmed`,
          [this.entityName]: entity,
        });
      }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
    }, 500);
  }

  onDeleteEntityRequested({ id }) {
    this.holder.delete({ id }).then(() => {
      const entity = this.entities.find((br) => br.id === id);
      this.entities = this.entities.filter((br) => br.id !== id);
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: `delete${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
  }

  onPostEntityRequested({ props }) {
    this.holder.post({ props }).then((entity) => {
      this.entities.push(entity);
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: `post${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} post`));
  }

  loadEntities() {
    this.holder.get().then((entities) => {
      this.entities = entities;
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: `set${this.ccEntityName}s`,
        [this.plural]: R.clone(this.entities),
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} loading`));
  }

  getErrorHandler(title) {
    return (err) => {
      console.error(err);
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: 'postNotification',
        title,
        message: err.message || err,
        kind: 'error',
      });
    };
  }

  render() {
    return null;
  }
}
