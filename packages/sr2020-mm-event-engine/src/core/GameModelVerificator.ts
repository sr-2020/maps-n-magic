import * as R from 'ramda';

export class GameModelVerificator {
  initErrors: any;

  constructor() {
    this.initErrors = [];
  }

  checkActionOverrides(service, actions, actionMap) {
    const actionIntersection = R.intersection(R.keys(actionMap), actions);
    if (!R.isEmpty(actionIntersection)) {
      actionIntersection.forEach((action) => {
        const service1 = service.constructor.name;
        const service2 = actionMap[action].constructor.name;
        this.initErrors.push(`Action with name ${action} is processed by two services: ${service1} and ${service2}`);
      });
    }
  }

  checkRequestOverrides(service, requests, requestMap) {
    const requestIntersection = R.intersection(R.keys(requestMap), requests);
    if (!R.isEmpty(requestIntersection)) {
      requestIntersection.forEach((request) => {
        const service1 = service.constructor.name;
        const service2 = requestMap[request].constructor.name;
        this.initErrors.push(`Request with name ${request} is processed by two services: ${service1} and ${service2}`);
      });
    }
  }

  verifyServices(services) {
    const allEmittedEvents = R.flatten(services.map((service) => service.metadata.emitEvents || []));
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
  }

  finishVerification() {
    if (!R.isEmpty(this.initErrors)) {
      this.initErrors.forEach((err) => console.error(err));
      throw new Error(`Found ${this.initErrors.length} errors during game model initialization\n${this.initErrors.join('\n')}`);
    }
  }
}
