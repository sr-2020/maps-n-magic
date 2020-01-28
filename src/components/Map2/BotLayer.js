import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { COLOR_PALETTE } from '../../utils/colorPalette';

export class BotLayer {
  botGroup = L.layerGroup([]);

  botGroupKey = 'botLayer';

  botTrackGroup = L.layerGroup([]);

  botTrackGroupKey = 'botTrackLayer';

  getLayersMeta() {
    return {
      [this.botTrackGroupKey]: this.botTrackGroup,
      [this.botGroupKey]: this.botGroup,
    };
  }

  getBotGroup() {
    return this.botGroup;
  }

  getBotGroupKey() {
    return this.botGroupKey;
  }

  getBotTrackGroup() {
    return this.botTrackGroup;
  }

  getBotTrackGroupKey() {
    return this.botTrackGroupKey;
  }

  onBotUpdate(bots, t, translator) {
    // console.log('On bot update');
    // const { t } = this.props;
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
}
