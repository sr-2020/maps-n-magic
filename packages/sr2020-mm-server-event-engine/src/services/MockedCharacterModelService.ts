import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  fetchWithTimeout,
  Req,
  Res,
  CharacterModelData,
} from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from '../api/constants';
import { 
  basicCharacter,
  suitedSpiritCharacter,
  dispiritCharacter,
  zeroSpiritAbilitiesCharacter
} from '../mockedData/characterModelData';
import { 
  CharacterModelServiceContract, 
  ClinicalDeathCombo, 
  Dispirit, 
  GetCharacterModelData, 
  SuitSpirit, 
  ZeroSpiritAbilities 
} from './CharacterModelService';

const pupMetadata: ServiceContractTypes<CharacterModelServiceContract> = {
  requests: [
    'characterModelData'
  ],
  actions: [
    'clinicalDeathCombo',
    'dispirit',
    'suitSpirit',
    'zeroSpiritAbilities',
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class MockedCharacterModelService extends AbstractService<CharacterModelServiceContract> {
  characterModelData: CharacterModelData = basicCharacter;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  // https://models-manager.evarun.ru/character/model/51935
  async getCharacterModelData({ modelId }: Req<GetCharacterModelData>): Res<GetCharacterModelData> {
    return this.characterModelData;
  }

  async suitSpirit({
    characterId, 
    spiritProps, 
    bodyStorageId, 
    spiritStorageId
  }: Req<SuitSpirit>): Res<SuitSpirit> {
    this.characterModelData = suitedSpiritCharacter;
    return null;
  }

  async dispirit({
    characterId, 
    bodyStorageId, 
    spiritStorageId
  }: Req<Dispirit>): Res<Dispirit> {
    this.characterModelData = dispiritCharacter;
    return null;
  }

  async clinicalDeathCombo({
    characterId, 
    bodyStorageId, 
    locationId
  }: Req<ClinicalDeathCombo>): Res<ClinicalDeathCombo> {
    const res2 = await this.dispirit({
      type: 'dispirit',
      characterId, 
      bodyStorageId, 
      spiritStorageId: null
    });
    return null;
  }

  async zeroSpiritAbilities({
    characterId, 
  }: Req<ZeroSpiritAbilities>): Res<ZeroSpiritAbilities> {
    this.characterModelData = zeroSpiritAbilitiesCharacter;
    return null;
  }
}
