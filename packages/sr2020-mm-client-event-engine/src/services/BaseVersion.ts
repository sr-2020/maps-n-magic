import { AbstractService } from 'sr2020-mm-event-engine';

export class BaseVersion extends AbstractService {
  // eslint-disable-next-line class-methods-use-this
  getData() {
    return {
      version: '0.2.0',
    };
  }
}
