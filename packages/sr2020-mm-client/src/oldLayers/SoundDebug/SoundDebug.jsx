import React, { Component } from 'react';
import './SoundDebug.css';

import { L } from "sr2020-mm-client-core/leafletWrapper";

import { musicSelectDom } from '../../utils/domUtils';

import { SoundStageEcho } from '../../components/SoundManager/SoundStageEcho';

// import { SoundDebugPropTypes } from '../../types';

export class SoundDebug extends Component {
  // static propTypes = SoundDebugPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      layerCommunicator,
    } = this.props;
    const legend = L.control({ position: 'bottomleft' });
    // const legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
      return musicSelectDom;
    };
    L.DomEvent.on(musicSelectDom, 'dblclick', (ev) => {
      L.DomEvent.stopPropagation(ev);
    });
    L.DomEvent.disableScrollPropagation(musicSelectDom);

    layerCommunicator.emit('addToMap', {
      control: legend,
    });
    console.log('SoundDebug mounted');
  }

  componentDidUpdate() {
    console.log('SoundDebug did update');
  }

  componentWillUnmount() {
    console.log('SoundDebug will unmount');
  }

  // getMusicSelect = () => null
  getMusicSelect() {
    const {
      gameModel,
    } = this.props;
      // if (!curMarker) {
      //   return null;
      // }
    return (
      <SoundStageEcho gameModel={gameModel} />
    // <MusicSelect gameModel={gameModel} />
    );
  }

  render() {
    return (
      <>
        {
          this.getMusicSelect()
        }
      </>
    );
  }
}
