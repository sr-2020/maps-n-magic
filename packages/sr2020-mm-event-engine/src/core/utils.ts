import * as R from 'ramda';

import { GMTyped } from "./types";

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

