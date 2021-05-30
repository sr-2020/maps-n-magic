import React, { Component, MouseEvent, FormEvent, useState, MouseEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './SpiritList.css';

import * as R from 'ramda';
import { WithTranslation } from "react-i18next";

import { 
  GameModel, 
  EPostSpiritRequested,
  EDeleteSpiritRequested, 
  ECloneSpiritRequested
} from "sr2020-mm-event-engine";

import { WithSpirits, WithSpiritFractions } from '../../../dataHOCs';

import { EntityList, EntitiyListItem, makeLinkGenerator } from "../../EntityList";

const spiritLink = makeLinkGenerator('spiritEditor');

interface SpiritListProps extends 
  WithTranslation, 
  RouteComponentProps, 
  WithSpirits, 
  WithSpiritFractions {
    gameModel: GameModel;
  }
export class SpiritList extends Component<SpiritListProps> {
  constructor(props: SpiritListProps) {
    super(props);
    this.createSpirit = this.createSpirit.bind(this);
    this.cloneSpirit = this.cloneSpirit.bind(this);
    this.removeSpirit = this.removeSpirit.bind(this);
  }

  createSpirit(spiritName: string): void {
    const { gameModel, history } = this.props;
    gameModel.emit2<EPostSpiritRequested>({
      type: 'postSpiritRequested',
      props: { name: spiritName },
    });
  }

  cloneSpirit(id: number): void {
    const { gameModel } = this.props;
    gameModel.emit2<ECloneSpiritRequested>({
      type: 'cloneSpiritRequested',
      id
    });
  }

  removeSpirit (id: number): void {
    const { gameModel } = this.props;
    gameModel.emit2<EDeleteSpiritRequested>({
      type: 'deleteSpiritRequested',
      id
    });
  }

  spiritsToListItems(): EntitiyListItem[] {
    const { spirits, spiritFractions } = this.props;
    if (spirits === null || spiritFractions === null) {
      return [];
    }
    const fractionIndex = R.indexBy(R.prop('id'), spiritFractions);
    const items: EntitiyListItem[] = spirits.map(spirit => ({
      id: spirit.id,
      title: spirit.name,
      subtitle: fractionIndex[spirit.fraction]?.name || ''
    }));
    return items;
  }

  render() {
    const { spiritFractions } = this.props;

    if (spiritFractions === null) {
      return null;
    }
    
    const items = this.spiritsToListItems();

    return (
      <EntityList
        items={items}
        onCreateEntity={this.createSpirit}
        onCloneEntity={this.cloneSpirit}
        onRemoveEntity={this.removeSpirit}
        makeLink={spiritLink}
        linkRoot="spiritEditor"
        createControlTitle="newSpirit"
        createFormTitle="enterSpiritName"
        createSubmitButtonText="createSpirit"
        findEntity="findSpirit"
        noEntitiesAdvice="createSpirits"
      />
    );
  }
}





