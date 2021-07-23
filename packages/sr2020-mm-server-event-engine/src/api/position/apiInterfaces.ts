import fetch from 'isomorphic-fetch';
import { createLogger } from '../../utils';

import { typelessValidateEntityFunction } from "../types";

const logger = createLogger('positionApiInterfaces.ts');

const LIMIT = 500;

export const gettable = (state: {
  url: string, 
  validateGetEntity: typelessValidateEntityFunction
}) => ({
  async get() {
    const response = await fetch(`${state.url}?limit=` + LIMIT);
    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`gettable network response was not ok ${response.ok} ${response.statusText}`);
    }

    const data: any[] = await response.json();

    if (data.length === LIMIT) {
      logger.warn(`GET limit ${LIMIT} reached by url ${state.url}`);
    }

    data.forEach(el => {
      if (!state.validateGetEntity(el)) {
        logger.info('GET Validation not passed.', JSON.stringify(el), JSON.stringify(state.validateGetEntity.errors));
      }
    });

    return data;
  },
});

export const postable = <T>(state: {
  url: string, 
  defaultObject: T,
  validatePostEntity: typelessValidateEntityFunction
}) => ({
  async post({ props }: {props: T}) {

    const object: T = {
      ...state.defaultObject,
      ...props,
    };

    if (!state.validatePostEntity(object)) {
      logger.info('POST Validation not passed.', JSON.stringify(object), JSON.stringify(state.validatePostEntity.errors));
    //   return;
    // } else {
    //   logger.info('POST validation OK');
    }

    const response = await fetch(state.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
      body: JSON.stringify(object),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`postable network response was not ok ${response.ok} ${response.statusText}`);
    }

    const responseObject = await response.json();

    // logger.info(responseObject);

    return responseObject;
  },
});

export const puttable = <T>(state: {
  url: string,
  validatePutEntity: typelessValidateEntityFunction
}) => ({
  async put({ id, props }: {id: number, props: T}) {
    if (!state.validatePutEntity(props)) {
      logger.info('PUT Validation not passed.', JSON.stringify(props), JSON.stringify(state.validatePutEntity.errors));
    //   return;
    // } else {
    //   logger.info('PUT validation OK');
    }

    const response = await fetch(`${state.url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
      body: JSON.stringify({
        ...props,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`puttable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
  },
});

export const multiPuttable = <T>(state: {
  url: string,
  validatePutEntity2: typelessValidateEntityFunction
}) => ({
  async putMultiple({ updates }: {
    updates: {
      id: number,
      body: Partial<T>
    }[]
  }) {
    updates.forEach(({ body }) => {
      if (!state.validatePutEntity2(body)) {
        logger.info('Multi PUT Validation not passed.', JSON.stringify(body), JSON.stringify(state.validatePutEntity2.errors));
        // return;
      // } else {
      //   logger.info('Multi PUT validation OK');
      }
    });

    const response = await fetch(`${state.url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`multiPuttable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
  },
});

export const deletable = (state: {url: string}) => ({
  async delete({ id }: {id: number}) {
    const response = await fetch(`${state.url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`deletable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response;
  },
});
