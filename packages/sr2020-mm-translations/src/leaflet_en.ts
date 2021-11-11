export const leafletGeomanTranslation = {
  tooltips: {
    placeMarker: 'Click to set beacon',
    firstVertex: 'Click to set first vertex',
    continueLine: 'Click to add vertex',
    // finishLine: 'Click any existing marker to finish',
    finishPoly: 'Click on first vertex to finish location',
    // finishRect: 'Click to finish',
    // startCircle: 'Click to place circle center',
    // finishCircle: 'Click to finish circle',
    // placeCircleMarker: 'Click to place circle marker',
  },
  actions: {
    finish: 'Finish',
    cancel: 'Cancel',
    removeLastVertex: 'Remove last vertex',
  },
  buttonTitles: {
    drawMarkerButton: 'Add beacon',
    drawPolyButton: 'Add location',
    // drawLineButton: 'Draw Polyline',
    // drawCircleButton: 'Draw Circle',
    // drawRectButton: 'Draw Rectangle',
    editButton: 'Edit location',
    dragButton: 'Drag location/beacon',
    // cutButton: 'Cut Layers',
    deleteButton: 'Remove location/beacon',
    // drawCircleMarkerButton: 'Draw Circle Marker',
  },
};

export function applyLeafletGeomanTranslation(map) {
  // map.pm.setLang('sr2020', leafletGeomanTranslation, 'ru');
  map.pm.setLang('sr2020', leafletGeomanTranslation, 'en');
}

export function getZoomTranslation() {
  return {
    zoomInTitle: 'Zoom In',
    zoomOutTitle: 'Zoom Out',
  };
}
