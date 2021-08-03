import * as R from 'ramda';

import { GMLogger, GMTyped } from "./types";

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function typeToGetter(type: string): string {
  return `get${capitalizeFirstLetter(type)}`;
}

export function stringToType<T extends GMTyped>(entity: string | GMTyped): T {
  if(R.is(String, entity)) {
    return {
      type: entity as string,
    } as T;
  }
  return entity as T;
}

export function getChildLogger(logger: GMLogger, defaultMeta: object) {
  let childLogger = logger;
  if (logger.customChild) {
    // childLogger = this.logger.customChild(this.logger, { service: service.constructor.name });
    childLogger = logger.customChild(logger, defaultMeta);
  }
  return childLogger;
}