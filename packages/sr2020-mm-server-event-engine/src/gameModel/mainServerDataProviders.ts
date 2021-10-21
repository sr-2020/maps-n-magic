import { 
  BackgroundImage,
  BeaconRecord, 
  CharacterLifeStyle, 
  CharLocationMessage, 
  CharLocChangeMessage, 
  Feature, 
  HealthChangeMessage, 
  LocationRecord, 
  ManaOceanEffectSettingsData, 
  ManaOceanSettingsData, 
  PlayerMessage, 
  RawSpellCast, 
  RawUserRecord, 
  Spirit, 
  SpiritFraction, 
  SpiritPhrase, 
  SpiritRoute, 
  validateCharLocationMessage, 
  validateCharLocChangeMessage, 
  validateHealthChangeMessage, 
  validateRawSpellCast
} from "sr2020-mm-event-engine";
import { LifeStyleProvider } from "../api/characterStates/getCharacterLifeStyle";
import { 
  charLocChange2SubscriptionName,
  charLocChangeSubscriptionName, 
  mainServerConstants, 
  manaOceanSpellCastSubscriptionName, 
  rescueServiceSubscriptionName 
} from "../api/constants";
import { FeatureProvider } from "../api/features";
import { 
  ManageablePlusResourceProvider, 
  ManageableResourceProvider, 
  MockedBeaconRecordProvider, 
  MockedLocationRecordProvider, 
  MockedUsersRecordProvider, 
  RemoteBeaconRecordProvider,
  RemoteLocationRecordProvider,
  RemoteUsersRecordProvider
} from "../api/position";
import { 
  ManaOceanEffectSettingsProvider, 
  ManaOceanSettingsProvider, 
  MockedManaOceanEffectSettingsProvider, 
  MockedManaOceanSettingsProvider, 
  SettingsResourceProvider 
} from "../api/settings";
import { 
  MockedBackgroundImageProvider,
  MockedFeatureProvider, 
  MockedLifeStyleProvider, 
  MockedPlayerMessageProvider, 
  MockedSpiritFractionProvider, 
  MockedSpiritPhraseProvider, 
  MockedSpiritProvider, 
  MockedSpiritRouteProvider, 
  PlayerMessageProvider, 
  SpiritFractionProvider, 
  SpiritPhraseProvider, 
  SpiritProvider, 
  SpiritRouteProvider 
} from "../api/spirits";
import { 
  Gettable, 
  Gettable2, 
  Manageable2, 
  ManageablePlus2, 
  SingleGettable, 
  SingleGettable2 
} from "../api/types";
import { PubSubDataSourceImpl } from "../dataManagers/PubSubDataSourceImpl";
import { MockedPubSubDataSource, PubSubDataSource } from "../dataManagers/types";


export interface MainServerDataProviders {
  // position
  beaconRecordProvider:             ManageableResourceProvider<BeaconRecord>;
  locationRecordProvider:           ManageablePlusResourceProvider<LocationRecord>;
  userRecordProvider:               Gettable<RawUserRecord> & SingleGettable<RawUserRecord>;
  backgroundImageProvider:          Manageable2<BackgroundImage>;

  // emercom
  lifeStyleProvider:                SingleGettable2<CharacterLifeStyle>;

  // mana ocean
  manaOceanSettingsProvider:        SettingsResourceProvider<ManaOceanSettingsData>;
  manaOceanEffectSettingsProvider:  SettingsResourceProvider<ManaOceanEffectSettingsData>;

  // spirits
  spiritProvider:                   ManageablePlus2<Spirit>;
  spiritFractionProvider:           Manageable2<SpiritFraction>;
  spiritRouteProvider:              Manageable2<SpiritRoute>;
  spiritPhraseProvider:             Manageable2<SpiritPhrase>;
  playerMessageProvider:            Gettable2<PlayerMessage> & SingleGettable2<PlayerMessage>;

  featureProvider:                  Gettable2<Feature> & SingleGettable2<Feature>;

  spellPubSub:                      PubSubDataSource<RawSpellCast>;
  charLocationPubSub:               PubSubDataSource<CharLocationMessage>;
  // actually it is the same as CharLocationMessage but there are some differences in typing
  charLocation2PubSub:              PubSubDataSource<CharLocChangeMessage>;
  healthChangePubSub:               PubSubDataSource<HealthChangeMessage>;
}

export function getDataProviders(): MainServerDataProviders {
  const mocked = mainServerConstants().MOCKED;
  // console.log('mocked', mocked);

  if (mocked) {
    return {
      beaconRecordProvider: new MockedBeaconRecordProvider(),
      locationRecordProvider: new MockedLocationRecordProvider(),
      userRecordProvider: new MockedUsersRecordProvider(),
      backgroundImageProvider: new MockedBackgroundImageProvider(),

      lifeStyleProvider: new MockedLifeStyleProvider(),
  
      manaOceanSettingsProvider: new MockedManaOceanSettingsProvider(),
      manaOceanEffectSettingsProvider: new MockedManaOceanEffectSettingsProvider(),
  
      spiritProvider: new MockedSpiritProvider(),
      spiritFractionProvider: new MockedSpiritFractionProvider(),
      spiritRouteProvider: new MockedSpiritRouteProvider(),
      spiritPhraseProvider: new MockedSpiritPhraseProvider(),
      playerMessageProvider: new MockedPlayerMessageProvider(),
  
      featureProvider: new MockedFeatureProvider(),

      spellPubSub: new MockedPubSubDataSource(),
      charLocationPubSub: new MockedPubSubDataSource(),
      charLocation2PubSub: new MockedPubSubDataSource(),
      healthChangePubSub: new MockedPubSubDataSource(),
    };
  }

  return {
    beaconRecordProvider: new RemoteBeaconRecordProvider(),
    locationRecordProvider: new RemoteLocationRecordProvider(),
    userRecordProvider: new RemoteUsersRecordProvider(),
    // background images are mocked only
    backgroundImageProvider: new MockedBackgroundImageProvider(),

    lifeStyleProvider: new LifeStyleProvider(),

    manaOceanSettingsProvider: new ManaOceanSettingsProvider(),
    manaOceanEffectSettingsProvider: new ManaOceanEffectSettingsProvider(),

    spiritProvider: new SpiritProvider(),
    spiritFractionProvider: new SpiritFractionProvider(),
    spiritRouteProvider: new SpiritRouteProvider(),
    spiritPhraseProvider: new SpiritPhraseProvider(),
    playerMessageProvider: new PlayerMessageProvider(),

    featureProvider: new FeatureProvider(),

    spellPubSub: new PubSubDataSourceImpl(
      manaOceanSpellCastSubscriptionName,
      validateRawSpellCast
    ),
    charLocationPubSub: new PubSubDataSourceImpl(
      charLocChangeSubscriptionName,
      validateCharLocationMessage
    ),
    charLocation2PubSub: new PubSubDataSourceImpl(
      charLocChange2SubscriptionName,
      validateCharLocChangeMessage
    ),
    healthChangePubSub: new PubSubDataSourceImpl(
      rescueServiceSubscriptionName,
      validateHealthChangeMessage
    )
  };
}