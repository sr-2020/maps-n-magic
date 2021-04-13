import React, { ChangeEventHandler, Component, ChangeEvent } from 'react';
import { 
  L, 
  LayersMeta, 
  CommonLayerProps,
  OnCreateLayerEvent,
  OnRemoveLayerEvent
} from "sr2020-mm-client-core";
import * as R from 'ramda';
import './BackgroundImageEditLayer.css';

import { getArrDiff, GameModel, BackgroundImage } from 'sr2020-mm-event-engine';

import { BackgroundImagePopup } from './BackgroundImagePopup';

import { BackgroundImageDisplayLayer } from '../BackgroundImageDisplayLayer';
import { InnerBgImageDisplayLayer } from './InnerBgImageDisplayLayer';

interface BackgroundImageEditLayerProps extends CommonLayerProps {
  gameModel: GameModel;
  enableByDefault: boolean;
  backgroundImages: BackgroundImage[];
}
interface BackgroundImageEditLayerState {
  curBackgroundImage: {
    image: string;
    id: number;
    name: string;
  } | null;
}

export class BackgroundImageEditLayer extends Component<
  BackgroundImageEditLayerProps, 
  BackgroundImageEditLayerState
> {
  imagePopupDom: HTMLElement;

  imagePopup: L.Popup;

  constructor(props: BackgroundImageEditLayerProps) {
    super(props);
    this.state = {
      curBackgroundImage: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.onRectangleClick = this.onRectangleClick.bind(this);
    this.onRectangleEdit = this.onRectangleEdit.bind(this);
  }

  componentDidMount() {
    // const {
    //   enableByDefault, layerCommunicator, backgroundImages,
    // } = this.props;
    this.imagePopupDom = document.createElement('div');
    // this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.imagePopup = L.popup();
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate() {
    // const {
    //   translator, backgroundImages,
    // } = this.props;
    // if (prevProps.backgroundImages !== backgroundImages) {
    // //   this.subscribe('off', prevProps.gameModel);
    // //   this.subscribe('on', gameModel);
    // //   this.clear();
    // //   this.populate();
    // }
    // if (prevProps.translator !== translator) {
    //   // this.clear();
    //   // this.populate();
    // }
    console.log('InnerManaOceanLayer2 did update');
  }

  componentWillUnmount() {
    this.communicatorSubscribe('off');
    console.log('InnerManaOceanLayer2 will unmount');
  }

  communicatorSubscribe(action: 'on'|'off') {
    const { layerCommunicator } = this.props;
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event: OnCreateLayerEvent) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Rectangle) {
      const rect = event.layer as L.Rectangle;
      console.log('rectangle created');
      // const latlngs = translator.moveFrom(rect.getLatLngs()[0] as L.LatLng[]); // as L.LatLng[][]
      const latlngs = rect.getLatLngs(); // as L.LatLng[][]
      gameModel.execute({
        type: 'postBackgroundImage',
        props: { latlngs },
      });
      rect.remove();
    }
  }

  onRemoveLayer(event: OnRemoveLayerEvent) {
    const {
      gameModel, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Rectangle) {
      const rect = event.layer;
      // const { id } = rect.options;
      console.log('rectangle removed');
      // this.imageLayer.onRemoveImage(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
      gameModel.execute({
        type: 'deleteBackgroundImage',
        id: rect.options.id,
      });
    }
  }

  onRectangleClick(e: L.LeafletMouseEvent) {
    const { layerCommunicator } = this.props;
    const {
      name, id, image,
    } = e.target.options;
    this.setState({
      curBackgroundImage: {
        id,
        name,
        image,
      },
    });
    layerCommunicator.emit('openPopup', {
      popup: this.imagePopup.setLatLng(e.latlng).setContent(this.imagePopupDom),
    });
  }

  onRectangleEdit(e: L.LeafletMouseEvent) {
    const {
      gameModel, layerCommunicator,
    } = this.props;
    const rectangle = e.target;
    gameModel.execute({
      type: 'putBackgroundImage',
      id: rectangle.options.id,
      props: {
        // ...translator.moveFrom({
        latlngs: rectangle.getLatLngs(),
        // }),
      },
    });
    layerCommunicator.emit('closePopup');
  }

  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  onBackgroundImageChange = (prop: 'name' | 'image') => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { gameModel } = this.props;
    if(!this.state.curBackgroundImage) return;
    const { id } = this.state.curBackgroundImage;

    if (prop === 'name' || prop === 'image') {
      // rectangle.options[prop] = value;
      gameModel.execute({
        type: 'putBackgroundImage',
        id,
        props: {
          [prop]: value,
        },
      });
    }

    // @ts-ignore
    this.setState((state) => {
      const curBackgroundImage = { ...state.curBackgroundImage, [prop]: value };
      return ({
        curBackgroundImage,
      });
    });
  }

  render() {
    const {
      curBackgroundImage,
    } = this.state;
    return (
      <>
        <BackgroundImageDisplayLayer {...this.props} />
        <InnerBgImageDisplayLayer
          onRectangleClick={this.onRectangleClick}
          onRectangleEdit={this.onRectangleEdit}
          {...this.props}
        />
        {
          !!curBackgroundImage
        && (
          <BackgroundImagePopup
            imagePopupDom={this.imagePopupDom}
            name={curBackgroundImage.name}
            // id={curBackgroundImage.id}
            image={curBackgroundImage.image}
            onClose={this.closePopup}
            onChange={this.onBackgroundImageChange}
          />
        )
        }
      </>
    );
  }
}
