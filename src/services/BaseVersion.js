import { AbstractService } from './AbstractService';

export class BaseVersion extends AbstractService {
  getData() {
    return {
      version: '0.2.0',
    };
  }
}
