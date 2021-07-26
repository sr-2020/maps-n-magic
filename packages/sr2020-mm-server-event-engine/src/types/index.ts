import { Spirit } from 'sr2020-mm-event-engine';
import { PutEntityArg } from '../dataManagers/CrudDataManager2';

export * from './spirits';
export * from './auth';

export interface PutSpiritRequestedCall {
  putSpiritRequested: ({ id, props }: PutEntityArg<Spirit>) => Promise<Spirit | null>;
}