import { EnvVariables, getEnvVariables } from "./envUtils";

enum GenericServerConstant {
  'NODE_ENV' = 'NODE_ENV',
  'GATEWAY_URL' = 'GATEWAY_URL',
  'MODELS_MANAGER_URL' = 'MODELS_MANAGER_URL',
  'JWT_SECRET' = 'JWT_SECRET',
}

export interface GenericServerConstants {
  JWT_SECRET: string;
  loginUrl: string;
  characterModelUrl: string;
  qrModelUrl: string;
  manaOceanConfigUrl: string;
  manaOceanEffectConfigUrl: string;
  playerServerTokenPayload: string;
  putLocationToModelsManager: string;
  modelsManagerToken: string;
};

export function getGenericEnvVariables() {
  return getEnvVariables(Object.values(GenericServerConstant), ['JWT_SECRET']);
}

export function getGenericServerConstants(envVariables: EnvVariables): GenericServerConstants {
  const { values } = envVariables;
  return {
    JWT_SECRET: values[GenericServerConstant.JWT_SECRET],
    loginUrl:                 values[GenericServerConstant.GATEWAY_URL] + '/api/v1/auth/login',
    manaOceanConfigUrl:       values[GenericServerConstant.GATEWAY_URL] + '/api/v1/config/manaOceanConfig',
    manaOceanEffectConfigUrl: values[GenericServerConstant.GATEWAY_URL] + '/api/v1/config/manaOceanEffectConfig',
    characterModelUrl:          values[GenericServerConstant.MODELS_MANAGER_URL] + '/character/model',
    qrModelUrl:                 values[GenericServerConstant.MODELS_MANAGER_URL] + '/qr/model',
    putLocationToModelsManager: values[GenericServerConstant.MODELS_MANAGER_URL] + '/location/default',
    playerServerTokenPayload: 'player-server',
    modelsManagerToken: process.env.MODELS_MANAGER_TOKEN || '',
  }
}

export function genericServerConstants2(): GenericServerConstants {
  const envVariables = getGenericEnvVariables();
  const { values } = envVariables;
  return {
    JWT_SECRET: values[GenericServerConstant.JWT_SECRET],
    loginUrl:                 values[GenericServerConstant.GATEWAY_URL] + '/api/v1/auth/login',
    manaOceanConfigUrl:       values[GenericServerConstant.GATEWAY_URL] + '/api/v1/config/manaOceanConfig',
    manaOceanEffectConfigUrl: values[GenericServerConstant.GATEWAY_URL] + '/api/v1/config/manaOceanEffectConfig',
    characterModelUrl:          values[GenericServerConstant.MODELS_MANAGER_URL] + '/character/model',
    qrModelUrl:                 values[GenericServerConstant.MODELS_MANAGER_URL] + '/qr/model',
    putLocationToModelsManager: values[GenericServerConstant.MODELS_MANAGER_URL] + '/location/default',
    playerServerTokenPayload: 'player-server',
    modelsManagerToken: process.env.MODELS_MANAGER_TOKEN || '',
  }
}

