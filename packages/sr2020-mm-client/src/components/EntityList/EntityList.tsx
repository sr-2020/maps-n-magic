import React, { Component, MouseEvent, FormEvent, useState, MouseEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './EntityList.css';

import { WithTranslation } from "react-i18next";

import { EntitiyListItem } from "./types";
import { InnerEntityList,  } from "./InnerEntityList";
import { InnerEntityRoutes } from "./InnerEntityRoutes";
import { CreateEntityControl } from "./CreateEntityControl";

import { Search } from './Search';
import { SRTKey } from 'sr2020-mm-client-core';


interface EntityListProps extends WithTranslation {
  items: EntitiyListItem[];
  onCreateEntity: (entityName: string) => void;
  onCloneEntity: (id: number) => void;
  onRemoveEntity: (id: number) => void;
  makeLink: (id: number, name: string) => string;
  linkRoot: string;
  createControlTitle: SRTKey;
  createFormTitle: SRTKey;
  createSubmitButtonText: SRTKey;
  findEntity: SRTKey;
  noEntitiesAdvice: SRTKey;
}
interface EntityListState {
  removedEntityIndex: number | null,
  searchStr: string,
}
export class EntityList extends Component<EntityListProps, EntityListState> {
constructor(props: EntityListProps) {
  super(props);
  this.state = {
    removedEntityIndex: null,
    searchStr: '',
  };
  this.onSearchChange = this.onSearchChange.bind(this);
  this.createEntity = this.createEntity.bind(this);
  this.cloneEntity = this.cloneEntity.bind(this);
  this.removeEntity = this.removeEntity.bind(this);
}

onSearchChange(searchStr: string) {
  this.setState({
    searchStr,
  });
}

createEntity(entityName: string): void {
  const { onCreateEntity } = this.props;
  onCreateEntity(entityName);
  // history.push(makeLink(id));
}

cloneEntity(e: MouseEvent<HTMLInputElement>): void {
  e.preventDefault();
  e.stopPropagation();
  // const { gameModel, history, makeLink } = this.props;
  const { onCloneEntity } = this.props;
  const { id } = e.currentTarget.dataset;
  onCloneEntity(Number(id));
  // history.push(makeLink(id));
}

removeEntity(e: MouseEvent<HTMLInputElement>): void {
  e.preventDefault();
  e.stopPropagation();
  const { id } = e.currentTarget.dataset;
  const { onRemoveEntity } = this.props;
  const idNumber = Number(id);
  onRemoveEntity(idNumber);
  const { items } = this.props;
  // if (items === null) {
  //   return;
  // }
  const index = items.findIndex((items) => items.id === idNumber);
  this.setState({
    removedEntityIndex: index,
  });
}

filterListItems(items: EntitiyListItem[]): EntitiyListItem[] {
  const { searchStr } = this.state;
  const lowerSearchStr = searchStr.toLowerCase();
  return items.filter(({title, subtitle}) => 
    title.toLowerCase().includes(lowerSearchStr) || 
    subtitle.toLowerCase().includes(lowerSearchStr)
  ); 
}

// eslint-disable-next-line max-lines-per-function
render() {
  const { removedEntityIndex, searchStr } = this.state;
  const { 
    t, 
    items, 
    // onCreateEntity, 
    makeLink, 
    linkRoot,
    createControlTitle,
    createFormTitle,
    createSubmitButtonText,
    findEntity,
    noEntitiesAdvice,
  } = this.props;

  return (
    <div className="EntityList tw-flex-grow-0 tw-flex tw-flex-col tw-bg-gray-200">
      <div className="tw-bg-gray-400 tw-flex-grow-0 tw-text-right tw-px-3 tw-py-2 tw-flex">
        <Search
          className="tw-flex-grow"
          placeholder={t(findEntity)}
          onSearchChange={this.onSearchChange}
        />
        <CreateEntityControl 
          onCreateEntity={this.createEntity}
          controlTitle={createControlTitle}
          formTitle={createFormTitle}
          submitButtonText={createSubmitButtonText}
        />
      </div>
      <InnerEntityRoutes 
        items={items}
        removedEntityIndex={removedEntityIndex}
        linkRoot={linkRoot}
        noEntitiesAdvice={noEntitiesAdvice}
        makeLink={makeLink}
      />
      <div className=" tw-flex-grow tw-overflow-auto" style={{flexBasis: 0}}>
        <InnerEntityList
          highlightStr={searchStr.toLowerCase()}
          items={this.filterListItems(items)}
          onCloneEntity={this.cloneEntity}
          onRemoveEntity={this.removeEntity}
          makeLink={makeLink}
        />
      </div>
    </div>
  );
}
}



