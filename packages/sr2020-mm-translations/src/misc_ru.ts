export const miscDictionary = {
  // layers
  botTrackLayer: 'Треки движения духов',
  botLayer: 'Духи',
  userLayer: 'Пользователь',
  imageGroupLayer: 'Здания',
  rectangleGroupLayer: 'Области зданий',
  titleGroupLayer: 'Подписи к зданиям',
  geoJsonLayer: 'Данные из Google Maps',
  geoJsonLayer_Polygon: 'Многоугольники из Google Maps',
  geoJsonLayer_Point: 'Маркеры из Google Maps',
  geoJsonLayer_LineString: 'Линии из Google Maps',

  // common
  cancel: 'Отмена',
  clone: 'Клонировать',
  delete: 'Удалить',
  clearSearchInput: 'Очистить поиск',
  notAvailable: 'Н/Д',

  // beacon popup
  selectBeaconId: 'Выберите Id маяка',
  selectBeaconIdForReplacing: 'Выберите Id для замены маяка {{id}}',

  // Map
  baseContourLayer: 'Контуры базы',
  beaconsLayer: 'Маяки',
  massCentersLayer: 'Центры масс',
  voronoiPolygonsLayer: 'Полигоны Вороного',
  signalRadiusesLayer: 'Радиус сигналов маяков',
  locationsLayer: 'Локации',
  locationsLayer_region_static: 'Регионы (readonly)',
  locationsLayer_geoLocation_static: 'Гео-локации (readonly)',
  locationsLayer_gameLocation_static: 'Игровые локации (readonly)',
  locationsLayer_region_editable: 'Регионы',
  locationsLayer_geoLocation_editable: 'Гео-локации',
  locationsLayer_gameLocation_editable: 'Игровые локации',
  locationType_region: 'Регион',
  locationType_geoLocation: 'Гео-локация',
  locationType_gameLocation: 'Игровая локация',
  locationType: 'Тип локации',
  borderWidth: 'Ширина границы',
  opacity: 'Прозрачность',
  color: 'Цвет',

  locationName: 'Название локации',
  markers: 'Маяки локации',
  markerTooltip: 'Маяк "{{name}}"',
  locationTooltip: 'Локация "{{name}}"',

  geoLocationTooltip: 'Геолокация "{{name}}"',
  manaGeoLocationTooltip: '{{name}}<br/>Уровень маны <b>{{manaLevel}}</b>',
  manaLevelNumber: 'Уровень маны <b>{{manaLevel}}</b>',
  manaEffect_massacre: 'Массакр',
  manaEffect_powerSpell: 'Мощное заклинание',
  manaEffect_ritualLocation: 'Отлив от ритуала',
  manaEffect_ritualNeighborLocation: 'Прилив от ритуала',
  manaEffect_inputStream: 'Input Stream',
  manaEffect_outputStream: 'Output Stream',
  manaEffect_inputStreamStart: 'Input Stream прилив',
  manaEffect_outputStreamStart: 'Output Stream отлив',
  manaEffect_inputStreamNeighbor: 'Input Stream отлив',
  manaEffect_outputStreamNeighbor: 'Output Stream прилив',
  addMassacre: 'Добавить массакр, мана +1',
  addCastRollback: 'Добавить откат заклинания, мана -1',
  regionTooltip: 'Регион "{{name}}"',
  gameLocationTooltip: 'Игровая локация "{{name}}"',
  unknownLocationTypeTooltip: 'Локация неизвестного типа "{{name}}"',

  noMarkers: 'Нет маяков',
  addMarker: 'Добавить',
  removeMarker: 'Удалить',
  manaLevel: 'Уровень маны',
  manalow: 'Низкий',
  mananormal: 'Обычный',
  manahigh: 'Высокий',
  selectMusic: 'Выбор звуков',
  noSound: 'Нет звука',

  markerName: 'Название маркера',
  latitude: 'Широта',
  longitude: 'Долгота',

  botTooltip: 'Дух "{{name}}"<br>Скорость {{speed}} м/с<br>Фракция {{fraction}}<br>Время остановки {{waitTime}}с',

  defaultSatelliteLayer: 'Спутниковая карта',
  locationCentroidLayer: 'Центроиды геолокаций',
  locationNeighborLayer: 'Соседние локации',
  beaconBindingsLayer: 'Привязки маяков',

  // track analysis
  trackDemo: 'Карта с треками пользователей',
  realTrackStats: 'Статистика по позиционированию пользователей',
  userTrackAnalysis: 'Анализ трека пользователя',

  // Beacon record editor
  newBeacon: 'Новый маяк',
  createBeacon: 'Создать маяк',
  // enterBeaconProperties: 'Введите свойства маяка',
  enterBeaconProperties: 'Введите MAC адрес маяка',
  beaconId: 'Id маяка',
  beaconMacAddress: 'Mac адрес',
  beaconLabel: 'Подпись',
  beaconPlacement: 'Место установки',

  backgroundImageName: 'Название изображения',
  backgroundImageUrl: 'Изображение',
  backgroundImagePreview: 'Превью',

  // misc
  location: 'Локация',
  characterId: 'Id персонажа',
  moveCharacterToLocation: 'Переместить персонажа в локацию',

  beaconHasNoLocation: 'Нет привязки к локации',

  locationHasNoBeaconsError: 'Перемещение игрока в следующие геолокации недоступно, потому что в них нет маяков.',

  rescueServiceMessageSender: 'Отправка сообщений МЧС о КС',
  warningRescueServiceSenderIsSimulator: 'Внимание! Данный инструмент симулирует сообщения об изменении состояния персонажей. Реального изменения состояния или локации персонажей не происходит.',

  physicalBodyCondition: 'Состояние физического тела',
  physicalBodyCondition_healthy: 'Здоров',
  physicalBodyCondition_wounded: 'Ранен',
  physicalBodyCondition_clinically_dead: 'Клиническая смерть',
  physicalBodyCondition_biologically_dead: 'Биологическая смерть',
  characterlifeStyle: 'Лайфстайл персонажа',

  sendRescueServiceMessage: 'Отправить сообщение в МЧС',
  unknownLocation: 'Неизвестная локация',
};