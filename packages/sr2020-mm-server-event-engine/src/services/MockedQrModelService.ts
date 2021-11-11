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
  sample,
} from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from '../api/constants';
import { emptyBodyStorageQr, emptySpiritJarQr, fullBodyStorageQr, fullSpiritJarQr } from '../mockedData/qrModels';
import { ExpectedQr, FreeSpiritFromStorage, GetQrModelData, PutSpiritInStorage, QrModelServiceContract } from './QrModelService';

const pupMetadata: ServiceContractTypes<QrModelServiceContract> = {
  requests: [
    'qrModelData'
  ],
  actions: [
    'freeSpiritFromStorage',
    'putSpiritInStorage'
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

const anySpiritJarQrs = [
  emptySpiritJarQr,
  fullSpiritJarQr,
];

const anyBodyStorageQrs = [
  emptyBodyStorageQr,
  fullBodyStorageQr,
];

const anyQrs = [
  ...anySpiritJarQrs,
  ...anyBodyStorageQrs
];

export class MockedQrModelService extends AbstractService<QrModelServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getQrModelData({ qrId, expectedQr }: Req<GetQrModelData>): Res<GetQrModelData> {
    if (expectedQr === ExpectedQr.fullSpiritJar) {
      return fullSpiritJarQr;
    }
    if (expectedQr === ExpectedQr.emptySpiritJar) {
      return emptySpiritJarQr;
    }
    if (expectedQr === ExpectedQr.fullBodyStorage) {
      return fullBodyStorageQr;
    }
    if (expectedQr === ExpectedQr.emptyBodyStorage) {
      return emptyBodyStorageQr;
    }
    if (expectedQr === ExpectedQr.anySpiritJar) {
      return sample(anySpiritJarQrs);
    }
    if (expectedQr === ExpectedQr.anyBodyStorage) {
      return sample(anyBodyStorageQrs);
    }
    // expectedQr === ExpectedQr.any
    return sample(anyQrs);
  }
  
  async freeSpiritFromStorage({
    spiritStorageId, 
    reason
  }: Req<FreeSpiritFromStorage>): Res<FreeSpiritFromStorage> {
  }
  
  async putSpiritInStorage({
    spiritStorageId, 
    spiritId
  }: Req<PutSpiritInStorage>): Res<PutSpiritInStorage> {
  }
}
