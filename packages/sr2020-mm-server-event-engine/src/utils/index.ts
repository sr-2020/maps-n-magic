import * as R from 'ramda';

import { Identifiable } from 'sr2020-mm-event-engine';

export * from './logger';
export * from './logUtils';

export function generateIntegerId<T extends Identifiable>(entities: T[]): { id: number } {
  const ids = R.pluck('id', entities) as number[];
  if (ids.length === 0) {
    return { id: 1 };
  }
  const maxId = ids.reduce((acc, id) => {
    if (acc < id) {
      return id;
    }
    return acc;
  }, ids[0]);
  return { id: maxId + 1 };
}