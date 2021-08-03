import React, { Component } from 'react';
import * as R from 'ramda';
import './SpiritRouteList.css';

import { WithTranslation } from "react-i18next";

import { 
  GameModel, 
  EPostSpiritRouteRequested,
  EDeleteSpiritRouteRequested, 
  ECloneSpiritRouteRequested
} from "sr2020-mm-event-engine";

import { WithSpiritRoutes } from '../../../dataHOCs';

import { EntityList, EntitiyListItem, makeLinkGenerator } from "../../EntityList";

const spiritRouteLink = makeLinkGenerator('spiritRouteEditor');


interface SpiritRouteListProps extends WithTranslation, WithSpiritRoutes {
  gameModel: GameModel;
}

export class SpiritRouteList extends Component<SpiritRouteListProps> {
  constructor(props: SpiritRouteListProps) {
    super(props);
    this.createSpiritRoute = this.createSpiritRoute.bind(this);
    this.cloneSpiritRoute = this.cloneSpiritRoute.bind(this);
    this.removeSpiritRoute = this.removeSpiritRoute.bind(this);
  }

  createSpiritRoute(spiritName: string): void {
    const { gameModel } = this.props;
    gameModel.emit2<EPostSpiritRouteRequested>({
      type: 'postSpiritRouteRequested',
      props: { name: spiritName },
    });
  }

  cloneSpiritRoute(id: number): void {
    const { gameModel } = this.props;
    gameModel.emit2<ECloneSpiritRouteRequested>({
      type: 'cloneSpiritRouteRequested',
      id
    });
  }

  removeSpiritRoute(id: number): void {
    const { gameModel } = this.props;
    gameModel.emit2<EDeleteSpiritRouteRequested>({
      type: 'deleteSpiritRouteRequested',
      id
    });
  }

  spiritRoutesToListItems(): EntitiyListItem[] {
    const { spiritRoutes } = this.props;
    if (spiritRoutes === null) {
      return [];
    }
    // const fractionIndex = R.indexBy(R.prop('id'), spiritFractions);
    const items: EntitiyListItem[] = spiritRoutes.map(route => ({
      id: route.id,
      title: route.name,
      subtitle: ''
    }));
    return items;
  }

  render() {
    const { spiritRoutes } = this.props;

    if (spiritRoutes === null) {
      return null;
    }
    
    const items = this.spiritRoutesToListItems();

    return (
      <EntityList
        className="SpiritRouteList"
        items={items}
        onCreateEntity={this.createSpiritRoute}
        onCloneEntity={this.cloneSpiritRoute}
        onRemoveEntity={this.removeSpiritRoute}
        makeLink={spiritRouteLink}
        linkRoot="spiritRouteEditor"
        createControlTitle="newSpiritRoute"
        createFormTitle="enterSpiritRouteName"
        createSubmitButtonText="createSpiritRoute"
        findEntity="findSpiritRoute"
        noEntitiesAdvice="createSpiritRoutes"
      />
    );
  }
}


