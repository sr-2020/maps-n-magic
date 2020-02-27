import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

export class InnerBackgroundImageLayer {
  imageGroup = L.layerGroup([]);

  rectangleGroup = L.layerGroup([]);

  imageGroupNameKey = 'imageGroupLayer';

  rectangleGroupNameKey = 'rectangleGroupLayer';

  getLayersMeta() {
    return {
      // [this.imageGroupNameKey]: this.imageGroup,
      [this.rectangleGroupNameKey]: this.rectangleGroup,
    };
  }

  clear() {
    this.imageGroup.clearLayers();
    this.rectangleGroup.clearLayers();
  }

  populate(gameModel, translator) {
    const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const images = imagesData.map(({
      // eslint-disable-next-line no-shadow
      latlngs, name, id, image,
    }) => L.rectangle(latlngs, {
      id, name, image,
    }));
    images.forEach((image) => {
      // setLocationEventHandlers(loc);
      // loc.on('mouseover', function (e) {
      //   loc.bindTooltip(t('locationTooltip', { name: this.options.name }));
      //   this.openTooltip();
      // });
      // loc.on('mouseout', function (e) {
      //   this.closeTooltip();
      // });
      this.rectangleGroup.addLayer(image);
    });
    // this.updateLocationsView();
  }

  // onCreateLocation(location, gameModel, translator, setLocationEventHandlers) {
  onCreateImage(rect, gameModel, translator, setLocationEventHandlers) {
    const latlngs = translator.moveFrom({
      latlngs: rect.getLatLngs(),
    });
    const { id, name, image } = gameModel.execute({
      type: 'postBackgroundImage',
      props: { ...latlngs },
    });
    L.setOptions(rect, { id, name, image });
    this.rectangleGroup.addLayer(rect);
    // setLocationEventHandlers(location);
    // this.updateLocationsView();
  }

  // onRemoveLocation(location, gameModel) {
  onRemoveImage(rect, gameModel) {
    this.rectangleGroup.removeLayer(rect);
    gameModel.execute({
      type: 'deleteBackgroundImage',
      id: rect.options.id,
    });
    // this.updateLocationsView();
  }

  // removeMarkerFromLocations(markerId, gameModel) {
  //   this.group.eachLayer((loc2) => {
  //     const props = loc2.options;
  //     if (R.contains(markerId, props.markers)) {
  //       props.markers = props.markers.filter((el) => el !== markerId);
  //       gameModel.execute({
  //         type: 'putLocation',
  //         id: props.id,
  //         props: {
  //           markers: R.clone(props.markers),
  //         },
  //       });
  //     }
  //   });
  // }

  // onLocMarkerChange(action, markerId, gameModel, locId) {
  //   this.removeMarkerFromLocations(markerId, gameModel);
  //   const loc = this.group.getLayers().find((loc2) => loc2.options.id === locId);
  //   const props = loc.options;
  //   if (action === 'add') {
  //     props.markers = [...props.markers];
  //     props.markers.push(markerId);
  //   } else if (action === 'remove') {
  //     props.markers = props.markers.filter((el) => el !== markerId);
  //   } else {
  //     console.error(`Unknown action ${action}`);
  //   }
  //   gameModel.execute({
  //     type: 'putLocation',
  //     id: locId,
  //     props: {
  //       markers: R.clone(props.markers),
  //     },
  //   });
  //   this.updateLocationsView();
  //   return props;
  // }

  // onLocationChange(prop, value, gameModel, id) {
  //   const location = this.group.getLayers().find((loc) => loc.options.id === id);
  //   if (prop === 'name' || prop === 'manaLevel') {
  //     location.options[prop] = value;
  //     gameModel.execute({
  //       type: 'putLocation',
  //       id,
  //       props: {
  //         [prop]: value,
  //       },
  //     });
  //   }
  // }

  // updateLocationsView() {
  //   this.group.getLayers().forEach((loc, i) => {
  //     const { markers, manaLevel } = loc.options;
  //     loc.setStyle({
  //       color: markers.length > 0 ? 'blue' : 'red',
  //       // fillColor: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
  //       // fillOpacity: 0.5,
  //       fillOpacity: 0.8,
  //       // eslint-disable-next-line no-nested-ternary
  //       // fillColor: COLOR_PALETTE[manaLevel === 'low' ? 0
  //       //   : (manaLevel === 'normal' ? 12
  //       //     : 16)].color.background,
  //       // eslint-disable-next-line no-nested-ternary
  //       fillColor: manaLevel === 'low' ? 'hsla(233, 0%, 50%, 1)'
  //         : (manaLevel === 'normal' ? 'hsla(233, 50%, 50%, 1)'
  //           : 'hsla(233, 100%, 50%, 1)'),
  //       // fillOpacity:
  //       //   // eslint-disable-next-line no-nested-ternary
  //       //   manaLevel === 'low' ? 0.2
  //       //     : (manaLevel === 'normal' ? 0.6
  //       //       : 1)
  //       // ,
  //     });
  //   });
  // }
}
