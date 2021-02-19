import React, { Component } from 'react';
import './BotLayer2.css';

import { L } from "sr2020-mm-client-core/leafletWrapper";
import * as R from 'ramda';

import { COLOR_PALETTE } from 'sr2020-mm-client-core/utils/colorPalette';

// import { BotLayer2PropTypes } from '../../types';

export class BotLayer2 extends Component {
  botGroup = L.layerGroup([]);

  botGroupKey = 'botLayer';

  botTrackGroup = L.layerGroup([]);

  botTrackGroupKey = 'botTrackLayer';
  // static propTypes = BotLayer2PropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onBotUpdate = this.onBotUpdate.bind(this);
  }

  componentDidMount() {
    const {
      translator, gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('BotLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const { gameModel, translator } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.clear();
      this.populate();
    }
    if (prevProps.translator !== translator) {
      this.clear();
      this.populate();
    }
    console.log('BotLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('BotLayer2 will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  populate() {
    const {
      gameModel,
    } = this.props;

    const bots = gameModel.get('activeBots');
    this.onBotUpdate({ bots });
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('botUpdate', this.onBotUpdate);
  }

  onBotUpdate({ bots }) {
    // console.log('On bot update');
    const { t, translator } = this.props;
    const botMap = R.indexBy((bot) => bot.getName(), bots);
    const botsOnMap = this.botGroup.getLayers();
    const botsTracksOnMap = this.botTrackGroup.getLayers();
    const curMarkers = {};
    botsOnMap.forEach((botMarker) => {
      const bot = botMap[botMarker.options.id];
      if (!bot) {
        this.botGroup.removeLayer(botMarker);
      } else {
        curMarkers[botMarker.options.id] = true;
        botMarker.setLatLng(translator.moveTo(bot.getCurPosition()));
      }
    });
    botsTracksOnMap.forEach((botTrack) => {
      const bot = botMap[botTrack.options.id];
      if (!bot) {
        this.botTrackGroup.removeLayer(botTrack);
      } else if (bot.getNextPoint()) {
        botTrack.setLatLngs(translator.moveTo([bot.getCurPosition(), bot.getNextPoint()]));
      }
    });
    bots.filter((bot) => !curMarkers[bot.getName()]).forEach((bot, i) => {
      const botMarker = L.marker(translator.moveTo(bot.getCurPosition()), { id: bot.getName() });
      botMarker.on('mouseover', function (e) {
        botMarker.bindPopup(t('botTooltip', {
          name: bot.getName(),
          speed: bot.getSpeed(),
          fraction: bot.getFraction(),
          waitTime: bot.getWaitTime(),
        }));
        this.openPopup();
      });
      botMarker.on('mouseout', function (e) {
        this.closeTooltip();
      });
      this.botGroup.addLayer(botMarker);
      if (bot.getNextPoint()) {
        // const botTrack = L.polyline(bot.getPath(), {
        const botTrack = L.polyline(translator.moveTo([bot.getCurPosition(), bot.getNextPoint()]), {
          id: bot.getName(),
          color: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
        });
        this.botTrackGroup.addLayer(botTrack);
      }
    });
  }

  getLayersMeta() {
    return {
      [this.botTrackGroupKey]: this.botTrackGroup,
      [this.botGroupKey]: this.botGroup,
    };
  }

  clear() {
    this.botGroup.clearLayers();
    this.botTrackGroup.clearLayers();
  }

  render() {
    return null;
  }
}
