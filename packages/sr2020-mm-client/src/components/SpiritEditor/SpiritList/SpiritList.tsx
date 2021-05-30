import React, { Component, MouseEvent, FormEvent, useState, MouseEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './SpiritList.css';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import * as R from 'ramda';
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {
  NavLink, Route, Redirect,
} from 'react-router-dom';
import Highlight from 'react-highlighter';
import { WithTranslation } from "react-i18next";

import { 
  Spirit,
  SpiritFraction,
  GameModel, 
  EPutSpirit, 
  EPostSpiritRequested,
  EDeleteSpiritRequested, 
  ECloneSpiritRequested
} from "sr2020-mm-event-engine";


import { EntitiyListItem } from "./types";
import { WithSpirits, WithSpiritFractions } from '../../../dataHOCs';
import { InnerEntityList,  } from "./InnerEntityList";
import { InnerEntityRoutes } from "./InnerEntityRoutes";
import { CreateEntityControl } from "./CreateEntityControl";
// import { EPutSpirit } from "sr2020-mm-client-event-engine";


import { Search } from './Search';
import { SRTKey } from 'sr2020-mm-client-core';

// spiritEditor
const makeLinkGenerator = (root: string) => (id: number, name: string) => `/${root}/${id}/${name}`;
const spiritLink = makeLinkGenerator('spiritEditor');

interface SpiritListProps extends 
  WithTranslation, 
  RouteComponentProps, 
  WithSpirits, 
  WithSpiritFractions {
    gameModel: GameModel;
  }
interface SpiritListState {
  // spirits: Spirit[],
  removedSpiritIndex: number | null,
  searchStr: string,
}

type ExtendedDropdownItemProps = DropdownItemProps & {
  readonly dataset: DOMStringMap
};

export class SpiritList extends Component<SpiritListProps, SpiritListState> {
  newSpiritInput: HTMLInputElement;

  constructor(props: SpiritListProps) {
    super(props);
    this.state = {
      // spirits: [],
      removedSpiritIndex: null,
      searchStr: '',
    };
    // this.onPutSpirit = this.onPutSpirit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.createNewSpirit = this.createNewSpirit.bind(this);
    this.cloneSpirit = this.cloneSpirit.bind(this);
    this.removeSpirit = this.removeSpirit.bind(this);
  }

  componentDidMount = () => {
    // console.log('SpiritList mounted');
  }

  componentDidUpdate = (prevProps: SpiritListProps) => {
    // console.log('SpiritList did update');
  }

  componentWillUnmount = () => {
    // console.log('SpiritList will unmount');
  }

  onSearchChange(searchStr: string) {
    this.setState({
      searchStr,
    });
  }

  createNewSpirit(spiritName: string): void {
    const { gameModel, history } = this.props;
    gameModel.emit2<EPostSpiritRequested>({
      type: 'postSpiritRequested',
      props: { name: spiritName },
    });
    // history.push(spiritLink(spirit));
    // this.setState((state) => {
    //   const spirits = sort([...state.spirits, spirit]);
    //   return {
    //     spirits,
    //     removedSpiritIndex: null,
    //   };
    // });
  }

  cloneSpirit(e: MouseEvent<HTMLInputElement>): void {
    e.preventDefault();
    e.stopPropagation();
    const { gameModel, history } = this.props;
    const { id } = e.currentTarget.dataset;
    // const spirit = spiritService.cloneSpirit(id);
    // const spirit = 
    gameModel.emit2<ECloneSpiritRequested>({
      type: 'cloneSpiritRequested',
      id: Number(id)
    });
    // history.push(spiritLink(spirit));
    // this.setState((state: SpiritListState) => {
    //   const spirits = sort([...state.spirits, spirit]);
    //   return {
    //     spirits,
    //     removedSpiritIndex: null,
    //   };
    // });
  }

  removeSpirit(e: MouseEvent<HTMLInputElement>): void {
    e.preventDefault();
    e.stopPropagation();
    const { gameModel } = this.props;
    const { id } = e.currentTarget.dataset;
    // spiritService.deleteSpirit(id);
    const idNumber = Number(id);
    gameModel.emit2<EDeleteSpiritRequested>({
      type: 'deleteSpiritRequested',
      id: idNumber
    });
    const { spirits } = this.props;
    if(spirits === null) {
      return;
    }
    const index = spirits.findIndex((spirit) => spirit.id === idNumber);
    this.setState({
      removedSpiritIndex: index,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { removedSpiritIndex, searchStr } = this.state;
    const { t, spirits, spiritFractions } = this.props;

    if (spiritFractions === null) {
      return null;
    }
    
    const items = spiritsToListItems(spirits, spiritFractions);

    return (
      <div className="SpiritList tw-flex-grow-0 tw-flex tw-flex-col tw-bg-gray-200">
        <div className="tw-bg-gray-400 tw-flex-grow-0 tw-text-right tw-px-3 tw-py-2 tw-flex">
          <Search
            className="tw-flex-grow"
            placeholder={t('findSpirit')}
            onSearchChange={this.onSearchChange}
          />
          <CreateEntityControl 
            // t={t}
            onCreateNewEntity={this.createNewSpirit}
            controlTitle="newSpirit"
            formTitle="enterSpiritName"
            submitButtonText="createSpirit"
          />
        </div>
        <InnerEntityRoutes 
          items={items}
          removedEntityIndex={removedSpiritIndex}
          linkRoot="spiritEditor"
          noEntitiesAdvice="createSpirits"
          makeLink={spiritLink}
        />
        <div className=" tw-flex-grow tw-overflow-auto">
          <InnerEntityList
            highlightStr={searchStr.toLowerCase()}
            items={filterListItems(searchStr, items)}
            clone={this.cloneSpirit}
            remove={this.removeSpirit}
            makeLink={spiritLink}
          />
        </div>
      </div>
    );
  }
}


// specific for spirits
function spiritsToListItems(
  spirits: Spirit[] | null, 
  spiritFractions: SpiritFraction[] | null,
  // searchStr: string
): EntitiyListItem[] {
  if (spirits === null || spiritFractions === null) {
    return [];
  }
  // const lowerSearchStr = searchStr.toLowerCase();
  const fractionIndex = R.indexBy(R.prop('id'), spiritFractions);
  // eslint-disable-next-line max-lines-per-function
  // const visibleSpirits = spirits.filter(
  //   (spirit) => spirit.name.toLowerCase().includes(lowerSearchStr) || 
  //   fractionIndex[spirit.fraction].name.toLowerCase().includes(lowerSearchStr)
  // );
  const items: EntitiyListItem[] = spirits.map(spirit => ({
    id: spirit.id,
    title: spirit.name,
    subtitle: fractionIndex[spirit.fraction]?.name || ''
  }));
  return items;
}

// common
function filterListItems(searchStr: string, items: EntitiyListItem[]): EntitiyListItem[] {
  const lowerSearchStr = searchStr.toLowerCase();
  return items.filter(({title, subtitle}) => 
    title.toLowerCase().includes(lowerSearchStr) || 
    subtitle.toLowerCase().includes(lowerSearchStr)
  ); 
}

