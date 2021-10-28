export const dictionary = {
  // index.tsx
  indexTitle: 'SR 2020 Магия',
  clickTwiceToEnableSound: 'Нажмите дважды для включения звука',

  // App.tsx
  characterPageTitle: 'Персонаж',
  historyPageTitle: 'История',
  catchSpiritPageTitle: 'Поймать духа',
  scanSpiritPageTitle: 'Осмотреть тотем',
  suitSpiritPageTitle: 'Надеть духа',
  dispiritPageTitle: 'Снять духа',
  emergencyDispiritPageTitle: 'Тело духа уничтожено',
  characterDataLoading: 'Загружаются данные персонажа...',

  // AppHeader.tsx
  // AppHeader2.tsx
  locationIsUnknown: 'Локация неизвестна',
  mute: 'Выключить звук',
  updateCharacterData: 'Обновить данные персонажа',
  logout: 'Выйти',

  // AuthWrapper.tsx
  loading: 'Загрузка...',

  // CatchSpiritPage.tsx
  unexpectedCatchSpiritError: 'CL Непредвиденная ошибка ловли духа',
  scanEmptySpiritJar: 'Отсканируйте пустой тотем',
  spiritIsCatched: 'Дух пойман',
  switchToSpiritList: 'Вернуться к списку духов',
  
  // CharacterPage.tsx
  astralBody: 'Астральное',
  physicalBody: 'Мясное',
  droneBody: 'Дрон',
  ectoplasmBody: 'Эктоплазменное',
  vrBody: 'VR',

  healthy: 'Здоров',
  wounded: 'Тяжело ранен',
  clinically_dead: 'КС',
  biologically_dead: 'АС',
  // characterDataLoading
  youCanWearSpiritTill: 'Вы можете быть в теле духа до ',
  youReadSpiritMessage: 'Вы прочитали мысль духа: ',
  returnYourBodyInTimeStart: 'Верните свое тело до',
  returnYourBodyInTimeEnd: ', чтобы не упасть в КС.',
  name: 'Имя',
  body: 'Тело',
  wearedSpirit: 'дух',
  healthState: 'Состояние',

  // DispiritComponent.tsx
  unexpectedBodyStorageCheckError: 'CL Непредвиденная ошибка проверки телохранилища',
  unexpectedDispiritError: 'CL Непредвиденная ошибка снятия духа',
  scanBodyStorage: 'Отсканируйте телохранилище',
  bodyStorage: 'Телохранилище',
  scan: 'Сканировать',
  dispirit: 'Снять',

  // DispiritPage.tsx
  // unexpectedSpiritJarCheckError
  unexpectedSpiritJarCheckError: 'CL Непредвиденная ошибка проверки тотема',
  // scanEmptySpiritJar
  spiritJar: 'Тотем',
  dispiritAndFree: 'Снять и отпустить духа',
  
  // EmergencyDispiritPage.tsx
  emergencyDispiritDone: 'Способности духа сняты. Надо быстрее вернуться в своё тело',
  unexpectedEmergencyDispiritError: 'CL Непредвиденная ошибка снятия способностей',
  emergencyDispiritExplanation1: 'Экстренное снятие духа происходит если хиты духа ушли в ноль.',
  emergencyDispiritExplanation2: 'Вы остаетесь в теле духа, но теряете все способности и идете надевать мясное тело. ',
  emergencyDispiritExplanation3: 'Полноценное снятие тела духа выполняется как обычное снятие.',
  confirmEmergencyDispirit: 'Подтвердить экстренное снятие',

  // HistoryPage.tsx
  unexpectedHistoryLoadingError: 'CL Непредвиденная ошибка получения истории',

  // LocationChangePage.tsx
  locationChangePage: 'Смена локации (отладка)',
  locationDataLoading: 'Данные о локации загружаются...',

  // LoginPage.tsx
  loginTitle: 'Логин',
  loginText: 'id профиля JoinRPG',
  passwordTitle: 'Пароль',
  passwordText: 'пин код из заявки / пароль мастера',
  login: 'Войти',

  // QrScannerWrapper.tsx
  qrScanError: 'Ошибка при сканировании QR',
  cancel: 'Отмена',
  changeCamera: 'Сменить камеру',
  onOffTorch: 'Вкл./Выкл. фонарик',

  // SpiritCard.tsx
  hitPoints: 'Хиты',
  level: 'Ранг',
  abilities: 'Абилки',

  // SpiritList.tsx
  // spiritListTitle: 'Духи ({{spiritNumber}})',
  missingSpiritCatcherSpell: 'Вы не овладели навыком Spirit Catcher, поэтому не видите духов вокруг и не можете их поймать',
  noSpiritsInLocation: 'В локации нет духов',
  // catchSpiritInfoText: `У вас {characterData.catcherData.attemptNumber} попытки 
  //   до {
  //     moment(characterData.catcherData.startTime + 
  //     characterData.catcherData.durationMillis).format('HH:mm')
  //   } 
  //   , вероятность поимки {characterData.catcherData.catchProbability}%`,
  castSpiritCatcherAdvice: 'Примените заклинание Spirit Catcher, чтобы ловить духов.',
  catch: 'Поймать',
  // needAbilityToCatchSpirit: 'Для ловли духа нужна способность {{spiritMasterName}}',

  // SpiritPage.tsx
  unexpectedSpiritViewError: 'CL Непредвиденная ошибка получения данных духа',
  unexpectedFreeSpiritError: 'CL Непредвиденная ошибка освобождения духа',
  scanSpiritJar: 'Отсканируйте тотем',
  mageFreedSpirit: 'Маг освободил духа',
  freeSpirit: 'Освободить духа',
  leaveMessage: 'Оставить сообщение',
  spiritJarIsEmpty: 'Тотем пуст',
  // emptinessReason: 'Причина: {{emptinessReason}}',
  scanOtherSpiritJar: 'Осмотреть другой тотем',

  // SuitSpiritPage.tsx
  spiritIsSuited: 'Дух надет',
  unexpectedSuitSpiritError: 'CL Непредвиденная ошибка надевания духа',
  youHaveNoSuitUpAbility: 'Вы не овладели навыком Suit Up (A), поэтому не можете надеть духа',
  scanSpiritJarWithSpirit: 'Отсканируйте тотем с духом',
  // spiritSuitTime: 'Время ношения духа {{timeInSpirit}} минут',
  suit: 'Надеть',
}