import { translitRuEn } from "sr2020-mm-event-engine";

export const dictionary = {
  // index.tsx
  indexTitle: 'SR 2020 Magic',
  clickTwiceToEnableSound: 'Click twice to enable sound',

  // App.tsx
  characterPageTitle: 'Character',
  historyPageTitle: 'History',
  catchSpiritPageTitle: 'Catch Spirit',
  scanSpiritPageTitle: 'Inspect Spirit Jar',
  suitSpiritPageTitle: 'Suit Spirit',
  dispiritPageTitle: 'Dispirit',
  emergencyDispiritPageTitle: 'Spirit Body Destroyed',
  characterDataLoading: 'Character data loading...',

  // AppHeader.tsx
  // AppHeader2.tsx
  locationIsUnknown: 'Location is unknown',
  mute: 'Mute',
  updateCharacterData: 'Update Character Data',
  logout: 'Logout',

  // AuthWrapper.tsx
  loading: 'Loading...',

  // CatchSpiritPage.tsx
  unexpectedCatchSpiritError: 'CL Unexpected catch spirit error',
  scanEmptySpiritJar: 'Scan empty spirit jar',
  spiritIsCatched: 'Spirit is catched',
  switchToSpiritList: 'Switch to spirit list',
  
  // CharacterPage.tsx
  astralBody: 'Astral',
  physicalBody: 'Physical',
  droneBody: 'Drone',
  ectoplasmBody: 'Ectoplasm',
  vrBody: 'VR',

  healthy: 'Healthy',
  wounded: 'Wounded',
  clinically_dead: 'Clinically dead',
  biologically_dead: 'Biologically dead',
  // characterDataLoading
  youCanWearSpiritTill: 'You can wear spirit till ',
  youReadSpiritMessage: 'You get spirit message: ',
  returnYourBodyInTimeStart: 'Return your body till',
  returnYourBodyInTimeEnd: ', to not fall in clinically dead.',
  name: 'Name',
  body: 'Body',
  wearedSpirit: 'spirit',
  healthState: 'Health state',

  // DispiritComponent.tsx
  unexpectedBodyStorageCheckError: 'CL Unexpected body storage check error',
  unexpectedDispiritError: 'CL Unexpected dispirit error',
  scanBodyStorage: 'Scan body storage',
  bodyStorage: 'Body storage',
  scan: 'Scan',
  dispirit: 'Dispirit',

  // DispiritPage.tsx
  // unexpectedSpiritJarCheckError
  unexpectedSpiritJarCheckError: 'CL Unexpected spirit jar check error',
  // scanEmptySpiritJar
  spiritJar: 'Spirit Jar',
  dispiritAndFree: 'Dispirit and free spirit',
  
  // EmergencyDispiritPage.tsx
  emergencyDispiritDone: 'Spirit abilities removed. You should quickly return your body.',
  unexpectedEmergencyDispiritError: 'CL Unexpected emergency dispirit error',
  emergencyDispiritExplanation1: 'Emergency dispirit happens when spirit hit points are zero.',
  emergencyDispiritExplanation2: 'You are still in spirit body but you have no spirit abilities and should return physical body.',
  emergencyDispiritExplanation3: '',
  confirmEmergencyDispirit: 'Confirm Emergency Dispirit',

  // HistoryPage.tsx
  unexpectedHistoryLoadingError: 'CL Unexpected history loading error',

  // LocationChangePage.tsx
  locationChangePage: 'Location Change (debug)',
  locationDataLoading: 'Location Data Loading...',

  // LoginPage.tsx
  loginTitle: 'Login',
  loginText: 'JoinRPG profile id',
  passwordTitle: 'Password',
  passwordText: 'pin code from claim / organizer password',
  login: 'Login',

  // QrScannerWrapper.tsx
  qrScanError: 'QR Scan error',
  cancel: 'Cancel',
  changeCamera: 'Change camera',
  onOffTorch: 'On/Off torch',

  // SpiritCard.tsx
  hitPoints: 'Hit points',
  level: 'Level',
  abilities: 'Abilities',

  // SpiritList.tsx
  // spiritListTitle: 'Духи ({{spiritNumber}})',
  missingSpiritCatcherSpell: 'You have no spell Spirit Catcher. By this reason you can\'t hear spirits and you can\'t catch them',
  noSpiritsInLocation: 'No Spirits in Location',
  // catchSpiritInfoText: `У вас {characterData.catcherData.attemptNumber} попытки 
  //   до {
  //     moment(characterData.catcherData.startTime + 
  //     characterData.catcherData.durationMillis).format('HH:mm')
  //   } 
  //   , вероятность поимки {characterData.catcherData.catchProbability}%`,
  castSpiritCatcherAdvice: 'Apply Spirit Catcher spell to catch spirits.',
  catch: 'Catch',
  // needAbilityToCatchSpirit: 'Для ловли духа нужна способность {{spiritMasterName}}',

  // SpiritPage.tsx
  unexpectedSpiritViewError: 'CL Unexpected spirit view error',
  unexpectedFreeSpiritError: 'CL Unexpected free spirit error',
  scanSpiritJar: 'Scan spirit jar',
  mageFreedSpirit: 'Mage freed spirit',
  freeSpirit: 'Free Spirit',
  leaveMessage: 'Leave message',
  spiritJarIsEmpty: 'Spirit jar is empty',
  // emptinessReason: 'Причина: {{emptinessReason}}',
  scanOtherSpiritJar: 'Scan other spirit jar',

  // SuitSpiritPage.tsx
  spiritIsSuited: 'Spirit is suited',
  unexpectedSuitSpiritError: 'CL Unexpected suit spirit error',
  youHaveNoSuitUpAbility: 'You have no Suit Up (A) ability so you can\'t suit spirit',
  scanSpiritJarWithSpirit: 'Scan spirit jar with spirit',
  // spiritSuitTime: 'Время ношения духа {{timeInSpirit}} минут',
  suit: 'Suit',
}

// SuitSpiritPage.tsx
export function spiritSuitTime(timeInSpirit: number) {
  return `You can wear spirit ${timeInSpirit} minutes`;
}

// SpiritPage.tsx
export function emptinessReason(emptinessReason: string | undefined) {
  return `Reason: ${emptinessReason}`;
}


// SpiritList.tsx
export function spiritListTitle(spiritNumber: number) {
  return `Spirits (${spiritNumber})`;
}

export function needAbilityToCatchSpirit(spiritMasterName: string) {
  return `You need ability ${spiritMasterName} to catch spirit`;
}

export function catchSpiritInfoText(
  attemptNumber: number, 
  tillTime: string,
  catchProbability: number, 
) {
  return `You have ${attemptNumber} attempts till ${tillTime}, catch probability ${catchProbability}%`;
}

export function processForDisplay(str: string): string {
  return translitRuEn(str);
}