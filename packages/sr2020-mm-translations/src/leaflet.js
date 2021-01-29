export const leafletGeomanTranslation = {
  tooltips: {
    placeMarker: 'Щелкните, чтобы поставить маяк',
    firstVertex: 'Щелкните, чтобы поставить первую вершину',
    continueLine: 'Щелкните, чтобы добавить вершину',
    // finishLine: 'Click any existing marker to finish',
    finishPoly: 'Щелкните первую точку, чтобы завершить локацию',
    // finishRect: 'Click to finish',
    // startCircle: 'Click to place circle center',
    // finishCircle: 'Click to finish circle',
    // placeCircleMarker: 'Click to place circle marker',
  },
  actions: {
    finish: 'Завершить',
    cancel: 'Отмена',
    removeLastVertex: 'Удалить последнюю вершину',
  },
  buttonTitles: {
    drawMarkerButton: 'Добавить маяк',
    drawPolyButton: 'Добавить локацию',
    // drawLineButton: 'Draw Polyline',
    // drawCircleButton: 'Draw Circle',
    // drawRectButton: 'Draw Rectangle',
    editButton: 'Редактировать локацию',
    dragButton: 'Перетащить локацию/маяк',
    // cutButton: 'Cut Layers',
    deleteButton: 'Удалить локацию/маяк',
    // drawCircleMarkerButton: 'Draw Circle Marker',
  },
};

export function applyLeafletGeomanTranslation(map) {
  map.pm.setLang('sr2020', leafletGeomanTranslation, 'ru');
}

export function getZoomTranslation() {
  return {
    zoomInTitle: 'Приблизить',
    zoomOutTitle: 'Отдалить',
  };
}
