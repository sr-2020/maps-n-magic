export const extraMainServerI18nDictionary = {
  logout: 'Выйти',
  loading: 'Загрузка...',
  longitude: 'Долгота',
  latitude: 'Широта',
  geoLocationsNotFound: 'Гео-локации не найдены',
  
  // CharacterLogs.tsx
  characterId: 'Id персонажа',
  showLogs: 'Показать логи',
  organizerLog: 'Лог мастерский:',
  playerLog: 'Лог игроцкий:',

  // CharacterPositions.tsx
  characterInLocation: 'Персонаж в {{label}}',
  locationUnknown: 'Локация неизвестна',

  // CharacterWatcher.tsx
  enterCharacterId: 'Введите Id персонажа',
  followCharacterLocationAndSound: 'Отслеживать локацию и звук',
  prevSelectedCharacters: 'Ранее выбранные персонажи',
  characterIdLabel: 'Персонаж {{id}}',
  locationIdLabel: 'Локация {{id}}',
  stopFollowing: 'Остановить отслеживание',
  
  // Emercom.tsx
  clickTwiceToEnableSound: 'Нажмите дважды для включения звука',
  emercomMap: 'Карта МЧС',

  // LoginPage.tsx
  login: 'Логин',
  joinRpgId: 'id профиля JoinRPG',
  password: 'Пароль',
  passwordAdvice: 'пин код из заявки / пароль мастера',
  enter: 'Войти',

  // ManaOceanEffectSettings.tsx
  massacre: 'Массакр',
  massacreDelay: 'Задержка, от 0 до 60 мин',
  massacreDuration: 'Длительность, от 1 до 60 мин',
  massacreManaChange: 'Эффект на ману, от 1 до 5',
  massacrePeopleLimit: 'Число людей, от 1 до 10',
  ritual: 'Ритуал',
  ritualMembersBoundary: 'Минимальное число участников, от 1 до 10',
  ritualDelay: 'Задержка, от 0 до 60 мин',
  powerSpell: 'Откат мощного заклинания',
  powerSpellBoundary: 'Минимальная мощь закла, от 1 до 10',
  powerSpellDelay: 'Задержка, от 0 до 60 мин',
  powerSpellDuration: 'Длительность, от 1 до 60 мин',
  manaSpell: 'Input/Output Stream',
  spellDurationItem: 'Длительность одной перекачки, от 1 до 10 мин',
  spellProbabilityPerPower: 'Вероятность применения на единицу мощи заклинания, от 5 до 100 процентов',
  spellDurationPerPower: 'Длительность заклинания на единицу мощи заклинания, от 1 до 10',
  
  // OrgSpiritCatch.tsx
  spiritId: 'Id духа',
  spiritJarId: 'Id тотема',
  putSpiritInJar: 'Отправить духа в тотем',
  result: 'Результат:',

  // PlayerMessages.tsx
  noFraction: 'Без фракции',
  barguzin: 'Баргузин',
  kultuk: 'Култук',
  sarma: 'Сарма',

  playerMessagesLoading: 'Сообщения игроков загружаются...',

  playerMessageLabel: 'Игрок {{characterId}} отпустил духа {{spiritId}} из фракции {{spiritFractionId}} {{fractionName}}',

  // RescueServiceSoundAlarm.tsx
  soundProhibitedTitle: 'Запрещено воспроизведение звука',
  soundProhibitedMessage: 'Действие 1. Попробуйте закрыть это сообщение (серьезно, это не шутка).',

  // RescueServiceTable.tsx
  minShort: 'мин',
  secShort: 'с',

  deathListIsEmpty: 'Список КС пуст',
  character: 'Персонаж',
  lifestyle: 'Лайфстайл',
  status: 'Статус',
  timeInSec: 'Время в С',

  // SoundStageEcho.tsx
  loadingSoundData: 'Загрузка звуковых данных...',

  // SoundResumer.tsx
  // clickTwiceToEnableSound

  // SpiritCatchers.tsx
  idCharacter: 'id персонажа',
  spiritCatcherStart: 'Начало заклинания',
  spiritCatcherEnd: 'Окончание заклинания',
  catchProbability: 'Вероятность поимки, %',
  attemptsNumber: 'Число попыток',

  // QrStatus.tsx
  enterQrId: 'Введите Id куара',
  check: 'Проверить',
  freeJarFromQr: 'Очистить куар от духа',

  // SpiritToQrConsistency.tsx
  makeSpiritConsistencyReport: 'Сформировать отчет о согласованности духов в океане',
  spiritsAreConsistent: 'Данные корректны',
  moveInconsistentSpiritsToAstral: 'Перевести всех несогласованных духов в астрал',
  batchSpiritJarCheck: 'Массовая проверка тотемов',
  batchBodyStorageCheck: 'Массовая проверка телохранилищ',

  // SpiritContent.tsx
  spiritLevel: 'Уровень',
  spiritHitPoints: 'Хиты',
  spiritAbilities: 'Абилки',

  // AbilitiesInput2.tsx
  featuresAreLoading: 'Фичи загружаются...',

  // SpiritStatusControl.tsx
  takeFromRoute: 'Снять с маршрута',
  spiritJarIdWithId: 'Id тотема {{qrId}}',
  forceClearSpiritState: 'Сбросить состояние',

  // SpiritFractionContent.tsx
  spiritFractionTitle: 'Фракция духов {{name}}',
  // spiritAbilities

  // SpiritOverview.tsx
  spiritOverviewDataLoading: 'Данные духов, фракций и маршрутов загружаются...',
  startRouteAt: 'Старт в {{minutes}}',
  timeOnRoute: 'Время в пути {{timeOnRoute}} мин.',

  // SpiritPhraseEditor.tsx
  // noFraction: 'Без фракции',
  // barguzin: 'Баргузин',
  // kultuk: 'Култук',
  // sarma: 'Сарма',
  spiritPhrasesLoading: 'Фразы духов загружаются...',
  createPhrase: 'Создать фразу',

  // CreateBeaconPopup.tsx
  title: 'Подпись',
  location: 'Локация',

  // ManaOceanLayer.tsx
  manaEffectSummary: '{{str}}, x{{length}} ({{timeStr}}), мана {{manaLevelSummary}}',

  // LocationPopup.tsx
  locationManaSummary: '{{str}}, {{time}}, мана {{manaLevelSummary}}',
};
