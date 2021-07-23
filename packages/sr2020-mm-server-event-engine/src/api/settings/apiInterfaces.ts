import fetch from 'isomorphic-fetch';
import { createLogger } from '../../utils';
import { typelessValidateEntityFunction } from '../types';

const logger = createLogger('settings/apiInterfaces.ts');

export const getSettings = (state: {
  url: string, 
  validateSettings: typelessValidateEntityFunction
}) => ({
  async get() {
    // logger.info('getSettings url', state.url);
    const response = await fetch(state.url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const text = await response.text();
      // logger.info(response);
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`get settings network response was not ok ${response.ok} ${response.statusText}`);
    }

    // return {};
    // const text = await response.text();

    const res = await response.json();

    if (!state.validateSettings(res)) {
      logger.info('Get settings validation not passed.', JSON.stringify(res), JSON.stringify(state.validateSettings.errors));
    // } else {
    //   logger.info('Get settings validation passed');
    }

    return res;
  },
});

export const postSettings = (state: {
  url: string, 
  validateSettings: typelessValidateEntityFunction
}) => ({
  async post(settings: unknown) {
    if (!state.validateSettings(settings)) {
      logger.info('Post settings validation not passed.', JSON.stringify(settings), JSON.stringify(state.validateSettings.errors));
    // } else {
    //   logger.info('Post settings validation passed');
    }
    const response = await fetch(state.url, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json;charset=utf-8',
      //   'X-User-Id': 1,
      // },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`post settings network response was not ok ${response.ok} ${response.statusText}`);
    }

    // logger.info('before parse post settings json');

    // return response.json();
    // something strange. response.json() returns error
    // just use settings instead
    return settings;
  },
});