import { 
  DefaultServiceContract, 
  EventProcessorMetadata, 
  Metadata, 
  ServiceContractTypes 
} from "../core/types";

export const mainServerMetadata: { 
  services: Record<string, Metadata>; 
  eventProcessors: Record<string, EventProcessorMetadata>; 
} = {
  "services": {
    "LocationRecordService": {
      "actions": [
        "putLocationRecord",
        "putLocationRecordConfirmed",
        "postLocationRecord",
        "postLocationRecordConfirmed",
        "deleteLocationRecord",
        "deleteLocationRecordConfirmed",
        "setLocationRecords",
        "putLocationRecords",
        "putLocationRecordsConfirmed"
      ],
      "requests": [
        "locationRecord",
        "locationRecords",
        "triangulationData",
        "neighborOrRandomLocation",
        "neighborList"
      ],
      "emitEvents": [
        "postLocationRecordRequested",
        "postLocationRecord",
        "deleteLocationRecordRequested",
        "deleteLocationRecord",
        "putLocationRecordRequested",
        "putLocationRecord",
        "putLocationRecordsRequested",
        "putLocationRecords",
        "locationRecordsChanged",
        "locationRecordsChanged2"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "BeaconRecordService": {
      "actions": [
        "putBeaconRecord",
        "putBeaconRecordConfirmed",
        "postBeaconRecord",
        "postBeaconRecordConfirmed",
        "deleteBeaconRecord",
        "deleteBeaconRecordConfirmed",
        "setBeaconRecords"
      ],
      "requests": [
        "beaconRecords"
      ],
      "emitEvents": [
        "putBeaconRecordRequested",
        "putBeaconRecord",
        "postBeaconRecordRequested",
        "postBeaconRecord",
        "deleteBeaconRecordRequested",
        "deleteBeaconRecord",
        "beaconRecordsChanged",
        "beaconRecordsChanged2"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "CharacterHealthStateService": {
      "actions": [],
      "requests": [
        "characterHealthState",
        "characterHealthStates"
      ],
      "emitEvents": [
        "characterHealthStateChanged",
        "characterHealthStatesLoaded"
      ],
      "needActions": [],
      "needRequests": [
        "locationRecord"
      ],
      "listenEvents": [
        "putCharHealthConfirmed",
        "putCharLocationConfirmed",
        "setCharacterHealthStates"
      ]
    },
    "UserRecordService": {
      "actions": [
        "setUserRecords"
      ],
      "requests": [
        "userRecord",
        "userRecords"
      ],
      "emitEvents": [
        "userRecordsChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "CharacterLocationService": {
      "actions": [],
      "requests": [
        "charactersFromLocation"
      ],
      "emitEvents": [
        "characterLocationChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "setAllCharacterLocations",
        "setCharacterLocation",
        "emitCharacterLocationChanged"
      ]
    },
    "BackgroundImageService": {
      "actions": [],
      "requests": [
        "backgroundImages",
        "backgroundImage"
      ],
      "emitEvents": [
        "postBackgroundImage",
        "postBackgroundImageRequested",
        "putBackgroundImage",
        "deleteBackgroundImage",
        "backgroundImagesChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "postBackgroundImageConfirmed",
        "putBackgroundImageConfirmed",
        "deleteBackgroundImageConfirmed",
        "setBackgroundImages",
        "cloneBackgroundImageRequested"
      ]
    },
    "MockedPostUserPositionService": {
      "actions": [
        "postUserPosition"
      ],
      "requests": [],
      "emitEvents": [],
      "needActions": [
        "setUserRecords"
      ],
      "needRequests": [
        "beaconRecords",
        "locationRecords",
        "userRecords"
      ],
      "listenEvents": []
    },
    "ManaOceanService": {
      "actions": [],
      "requests": [],
      "emitEvents": [],
      "needActions": [
        "putLocationRecord",
        "putLocationRecords",
        "pushNotification"
      ],
      "needRequests": [
        "settings",
        "locationRecords",
        "locationRecord",
        "enableManaOcean",
        "neighborOrRandomLocation",
        "neighborList"
      ],
      "listenEvents": [
        "massacreTriggered",
        "spellCast",
        "wipeManaOceanEffects",
        "removeManaEffect",
        "addManaEffect"
      ]
    },
    "ManaOceanEnableService": {
      "actions": [
        "setEnableManaOcean"
      ],
      "requests": [
        "enableManaOcean"
      ],
      "emitEvents": [
        "enableManaOceanRequested",
        "enableManaOceanChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "enableManaOceanConfirmed"
      ]
    },
    "MassacreService": {
      "actions": [],
      "requests": [],
      "emitEvents": [
        "massacreTriggered"
      ],
      "needActions": [],
      "needRequests": [
        "settings"
      ],
      "listenEvents": [
        "characterHealthStateChanged"
      ]
    },
    "SettingsService": {
      "actions": [
        "postSettings",
        "postSettingsConfirmed",
        "setSettings"
      ],
      "requests": [
        "settingsCatalog",
        "settings"
      ],
      "emitEvents": [
        "postSettings",
        "postSettingsRequested",
        "settingsChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "SpiritService": {
      "actions": [],
      "requests": [
        "spirits",
        "spirit"
      ],
      "emitEvents": [
        "postSpirit",
        "postSpiritRequested",
        "putSpirit",
        "deleteSpirit",
        "spiritsChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "postSpiritConfirmed",
        "putSpiritConfirmed",
        "deleteSpiritConfirmed",
        "setSpirits",
        "cloneSpiritRequested",
        "putSpiritsConfirmed"
      ]
    },
    "SpiritFractionService": {
      "actions": [],
      "requests": [
        "spiritFractions",
        "spiritFraction"
      ],
      "emitEvents": [
        "putSpiritFraction",
        "spiritFractionsChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "putSpiritFractionConfirmed",
        "setSpiritFractions"
      ]
    },
    "SpiritRouteService": {
      "actions": [],
      "requests": [
        "spiritRoutes",
        "spiritRoute"
      ],
      "emitEvents": [
        "postSpiritRoute",
        "postSpiritRouteRequested",
        "putSpiritRoute",
        "deleteSpiritRoute",
        "spiritRoutesChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "postSpiritRouteConfirmed",
        "putSpiritRouteConfirmed",
        "deleteSpiritRouteConfirmed",
        "setSpiritRoutes",
        "cloneSpiritRouteRequested"
      ]
    },
    "SpiritMovementService": {
      "actions": [],
      "requests": [],
      "emitEvents": [
        "putSpiritsRequested"
      ],
      "needActions": [],
      "needRequests": [
        "spirits",
        "spiritRoutes",
        "enableSpiritMovement"
      ],
      "listenEvents": []
    },
    "SpiritMovementEnableService": {
      "actions": [
        "setEnableSpiritMovement"
      ],
      "requests": [
        "enableSpiritMovement"
      ],
      "emitEvents": [
        "enableSpiritMovementRequested",
        "enableSpiritMovementChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "enableSpiritMovementConfirmed"
      ]
    },
    "SpiritCatcherService": {
      "actions": [
        "removeCatcherStates",
        "decrementAttempt",
        "setCatcherStates"
      ],
      "requests": [
        "catcherState",
        "catcherStates"
      ],
      "emitEvents": [
        "catcherStatesChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "spellCast"
      ]
    },
    "SpiritCatcherUpdateService": {
      "actions": [],
      "requests": [],
      "emitEvents": [],
      "needActions": [
        "removeCatcherStates"
      ],
      "needRequests": [
        "catcherStates"
      ],
      "listenEvents": []
    },
    "SpiritPhraseService": {
      "actions": [],
      "requests": [
        "spiritPhrases",
        "spiritPhrase",
        "randomSpiritPhrase"
      ],
      "emitEvents": [
        "postSpiritPhrase",
        "postSpiritPhraseRequested",
        "putSpiritPhrase",
        "deleteSpiritPhrase",
        "spiritPhrasesChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "postSpiritPhraseConfirmed",
        "putSpiritPhraseConfirmed",
        "deleteSpiritPhraseConfirmed",
        "setSpiritPhrases"
      ]
    },
    "PlayerMessagesService": {
      "actions": [],
      "requests": [
        "playerMessages"
      ],
      "emitEvents": [
        "playerMessagesChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "setPlayerMessages"
      ]
    },
    "MockedQrModelService": {
      "actions": [
        "freeSpiritFromStorage",
        "putSpiritInStorage"
      ],
      "requests": [
        "qrModelData"
      ],
      "emitEvents": [],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "MockedCharacterModelService": {
      "actions": [
        "clinicalDeathCombo",
        "dispirit",
        "suitSpirit",
        "zeroSpiritAbilities"
      ],
      "requests": [
        "characterModelData"
      ],
      "emitEvents": [],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "FeatureService": {
      "actions": [],
      "requests": [
        "features",
        "feature"
      ],
      "emitEvents": [
        "featuresChanged"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": [
        "setFeatures"
      ]
    },
    "PushNotificationService": {
      "actions": [
        "pushNotification"
      ],
      "requests": [],
      "emitEvents": [
        "pushNotification"
      ],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "MockedAuthService": {
      "actions": [],
      "requests": [
        "userToken"
      ],
      "emitEvents": [],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "MockedUserLogService": {
      "actions": [
        "putUserLogRecord"
      ],
      "requests": [
        "userLog"
      ],
      "emitEvents": [],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    },
    "MockedMainLogService": {
      "actions": [
        "putMainLogRecord"
      ],
      "requests": [
        "mainLog"
      ],
      "emitEvents": [],
      "needActions": [],
      "needRequests": [],
      "listenEvents": []
    }
  },
  "eventProcessors": {
    "beaconRecordDataBinding": {
      "emitEvents": [
        "postNotification"
      ],
      "listenEvents": [
        "postBeaconRecordRequested",
        "putBeaconRecordRequested",
        "deleteBeaconRecordRequested"
      ]
    },
    "locationRecordDataBinding": {
      "emitEvents": [
        "postNotification"
      ],
      "listenEvents": [
        "postLocationRecordRequested",
        "putLocationRecordRequested",
        "deleteLocationRecordRequested",
        "putLocationRecordsRequested"
      ]
    },
    "userRecordDataBinding": {
      "emitEvents": [
        "postNotification"
      ],
      "listenEvents": []
    },
    "backgroundImageDataBinding": {
      "emitEvents": [
        "setBackgroundImages",
        "postNotification",
        "postBackgroundImageConfirmed",
        "putBackgroundImageConfirmed",
        "deleteBackgroundImageConfirmed"
      ],
      "listenEvents": [
        "postBackgroundImageRequested",
        "putBackgroundImageRequested",
        "deleteBackgroundImageRequested"
      ]
    },
    "manaOceanSettingsDB": {
      "emitEvents": [
        "postNotification"
      ],
      "listenEvents": [
        "postSettingsRequested"
      ]
    },
    "manaOceanEffectsSettingsDB": {
      "emitEvents": [
        "postNotification"
      ],
      "listenEvents": [
        "postSettingsRequested"
      ]
    },
    "spiritDataBinding": {
      "emitEvents": [
        "setSpirits",
        "postNotification",
        "postSpiritConfirmed",
        "putSpiritConfirmed",
        "deleteSpiritConfirmed",
        "putSpiritsConfirmed"
      ],
      "listenEvents": [
        "postSpiritRequested",
        "putSpiritRequested",
        "deleteSpiritRequested",
        "putSpiritsRequested"
      ]
    },
    "spiritFractionDataBinding": {
      "emitEvents": [
        "setSpiritFractions",
        "postNotification",
        "postSpiritFractionConfirmed",
        "putSpiritFractionConfirmed",
        "deleteSpiritFractionConfirmed"
      ],
      "listenEvents": [
        "postSpiritFractionRequested",
        "putSpiritFractionRequested",
        "deleteSpiritFractionRequested"
      ]
    },
    "spiritRouteDataBinding": {
      "emitEvents": [
        "setSpiritRoutes",
        "postNotification",
        "postSpiritRouteConfirmed",
        "putSpiritRouteConfirmed",
        "deleteSpiritRouteConfirmed"
      ],
      "listenEvents": [
        "postSpiritRouteRequested",
        "putSpiritRouteRequested",
        "deleteSpiritRouteRequested"
      ]
    },
    "spiritPhraseDataBinding": {
      "emitEvents": [
        "setSpiritPhrases",
        "postNotification",
        "postSpiritPhraseConfirmed",
        "putSpiritPhraseConfirmed",
        "deleteSpiritPhraseConfirmed"
      ],
      "listenEvents": [
        "postSpiritPhraseRequested",
        "putSpiritPhraseRequested",
        "deleteSpiritPhraseRequested"
      ]
    },
    "playerMessagesDataBinding": {
      "emitEvents": [
        "setPlayerMessages",
        "postNotification"
      ],
      "listenEvents": []
    },
    "featureDataBinding": {
      "emitEvents": [
        "setFeatures",
        "postNotification"
      ],
      "listenEvents": []
    },
    "CharacterLocDataManager": {
      "emitEvents": [
        "setCharacterLocation",
        "setAllCharacterLocations",
        "postNotification"
      ],
      "listenEvents": []
    },
    "CharacterStatesListener": {
      "emitEvents": [
        "putCharHealthRequested"
      ],
      "listenEvents": []
    },
    "CharacterLocationListener": {
      "emitEvents": [
        "putCharLocationRequested"
      ],
      "listenEvents": []
    },
    "SpellCastsListener": {
      "emitEvents": [
        "spellCast"
      ],
      "listenEvents": []
    },
    "RedirectDataBinding2": {
      "emitEvents": [
        "putCharHealthConfirmed",
        "putCharLocationConfirmed",
        "enableManaOceanConfirmed",
        "enableSpiritMovementConfirmed"
      ],
      "listenEvents": [
        "putCharHealthRequested",
        "putCharLocationRequested",
        "enableManaOceanRequested",
        "enableSpiritMovementRequested"
      ]
    },
    "StubEventProcessor": {
      "emitEvents": [
        "emitCharacterLocationChanged",
        "addManaEffect",
        "removeManaEffect",
        "wipeManaOceanEffects",
        "setCharacterHealthStates",
        "postSpiritRequested",
        "putSpiritRequested",
        "deleteSpiritRequested",
        "cloneSpiritRequested",
        "postSpiritFractionRequested",
        "putSpiritFractionRequested",
        "deleteSpiritFractionRequested",
        "postSpiritRouteRequested",
        "putSpiritRouteRequested",
        "deleteSpiritRouteRequested",
        "cloneSpiritRouteRequested",
        "putSpiritPhraseRequested",
        "deleteSpiritPhraseRequested",
        "postBackgroundImageRequested",
        "putBackgroundImageRequested",
        "deleteBackgroundImageRequested",
        "cloneBackgroundImageRequested",
        "setCatcherStates"
      ],
      "listenEvents": []
    }
  }
}