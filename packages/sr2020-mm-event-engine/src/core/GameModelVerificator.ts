import * as R from 'ramda';
import { AbstractService } from './AbstractService';
import { AbstractEventProcessor } from './AbstractEventProcessor';
import { ServiceIndex } from './GameModel';

export class GameModelVerificator {
  initErrors: string[];

  constructor() {
    this.initErrors = [];
  }

  checkActionOverrides(service: AbstractService, actions: string[], actionMap: ServiceIndex): void {
    const actionIntersection = R.intersection(R.keys(actionMap), actions);
    if (!R.isEmpty(actionIntersection)) {
      actionIntersection.forEach((action) => {
        const service1 = service.constructor.name;
        const service2 = actionMap[action].constructor.name;
        this.initErrors.push(`Action with name ${action} is processed by two services: ${service1} and ${service2}`);
      });
    }
  }

  checkRequestOverrides(service: AbstractService, requests: string[], requestMap: ServiceIndex): void {
    const requestIntersection = R.intersection(R.keys(requestMap), requests);
    if (!R.isEmpty(requestIntersection)) {
      requestIntersection.forEach((request) => {
        const service1 = service.constructor.name;
        const service2 = requestMap[request].constructor.name;
        this.initErrors.push(`Request with name ${request} is processed by two services: ${service1} and ${service2}`);
      });
    }
  }

  verifyEvents(services: AbstractService[], eventProcessors: AbstractEventProcessor[]): void {
    // console.log('services', services.length);
    const allServiceEmittedEvents = R.flatten(services.map((service) => service.metadata.emitEvents || []));
    const allEPEmittedEvents = R.flatten(eventProcessors.map((ep) => ep.getMetadata().emitEvents || []));
    const allEmittedEvents = [...allServiceEmittedEvents, ...allEPEmittedEvents];
    // console.log(allEmittedEvents);
    services.forEach((service) => {
      const { listenEvents = [] } = service.metadata;
      const diff = R.difference(listenEvents, allEmittedEvents);
      if (!R.isEmpty(diff)) {
        diff.forEach((eventname) => {
          const serviceName = service.constructor.name;
          this.initErrors.push(`No event emitter for ${eventname} which is expected by ${serviceName}`);
        });
      }
    });
    eventProcessors.forEach((ep) => {
      const { listenEvents = [] } = ep.getMetadata();
      const diff = R.difference(listenEvents, allEmittedEvents);
      if (!R.isEmpty(diff)) {
        diff.forEach((eventname) => {
          const epName = ep.constructor.name;
          this.initErrors.push(`No event emitter for ${eventname} which is expected by ${epName}`);
        });
      }
    });
  }

  finishVerification(): void {
    if (!R.isEmpty(this.initErrors)) {
      this.initErrors.forEach((err) => console.error(err));
      throw new Error(`Found ${this.initErrors.length} errors during game model initialization\n${this.initErrors.join('\n')}`);
    }
  }
}
